import {
  decodeBase64,
  encodeBase64,
  getPartitionKey,
} from "../../utils/chat/index.js";

import {
  getRecentChats,
  getChatByUserPair,
  getRecentChatByUserPair,
  pushMessage,
  putRecentChatByMessageId,
} from "../../repositories/chat/index.js";

import {
  deleteMatchById,
  getMatchByUserPair,
} from "../../repositories/match/index.js";

import { docClient } from "../../utils/db/index.js";

import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";

/**
 * @type {Object.<string, import("express").Response>}
 */
const subscribers = {};

/**
 * @description function for retrieving all chat
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getChats(req, res) {
  const userId = req.profile.id;

  const items = await getRecentChats(userId);

  // TODO: map user_id to user
  const ret = items.map((item) => {
    return {
      recipient_name: "name: " + item.recipient_id,
      img_url: "/icons/user-bottom.svg",
      ...item,
    };
  });

  res.json(ret);
}

/**
 * @description function for retrieving chat
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getChat(req, res) {
  const userId = req.profile.id;
  const { id: targetId } = req.params;

  const { q: encodedLastKey } = req.query;

  let lastKey;

  if (encodedLastKey) {
    try {
      lastKey = JSON.parse(decodeBase64(encodedLastKey));

      if (!validateLastKey(lastKey)) {
        return res.status(400).send("Invalid last key");
      }
    } catch {
      return res.status(400).send("Invalid last key");
    }
  }

  const partitionKey = getPartitionKey(userId, targetId);

  const items = await getChatByUserPair(partitionKey, lastKey);

  // Update seen status
  const newSeen = items.data.filter((x) => !x.seen && x.author != userId);

  if (newSeen.length > 0) {
    // in chat table
    /** @type {import('@aws-sdk/lib-dynamodb').TransactWriteCommandInput} */
    const transactionCommandInput = {
      TransactItems: [],
    };

    newSeen.forEach((message) => {
      message.seen = true;

      transactionCommandInput.TransactItems.push({
        Update: {
          TableName: "chat",
          Key: {
            id: message.id,
          },
          ExpressionAttributeValues: {
            ":t": {
              BOOL: "true",
            },
          },
          UpdateExpression: "SET seen = :t",
        },
      });
    });

    // in recent chat table
    getRecentChatByUserPair(partitionKey).then((recentChats) => {
      recentChats.forEach((recentChat) => {
        transactionCommandInput.TransactItems.push({
          Update: {
            TableName: "recent_chat",
            Key: {
              id: recentChat.id,
            },
            ExpressionAttributeValues: {
              ":t": "true",
            },
            UpdateExpression: "SET seen = :t",
          },
        });
      });

      docClient.send(new TransactWriteCommand(transactionCommandInput));
    });
  }

  // sending last key for pagination
  let lastEvaluatedKey;

  if (items.metadata.LastEvaluatedKey) {
    lastEvaluatedKey = encodeBase64(
      JSON.stringify(items.metadata.LastEvaluatedKey)
    );
  }

  res.json({ messages: items.data, lastKey: lastEvaluatedKey });
}

/**
 * @description controller for sending message.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function postChat(req, res) {
  const userId = req.profile.id;
  const { id: targetId } = req.params;
  const { payload } = req.body;

  const partitionKey = getPartitionKey(userId, targetId);

  await pushMessage(partitionKey, userId, payload);

  emitEvent(targetId, "_message", {
    author: userId,
    payload,
  });

  // Update recent chat
  getRecentChatByUserPair(partitionKey).then((items) => {
    const recentChatAuthor = items.find((item) => item.user_id == userId);
    if (recentChatAuthor) {
      putRecentChatByMessageId(
        recentChatAuthor.id,
        partitionKey,
        recentChatAuthor.user_id,
        recentChatAuthor.recipient_id,
        userId,
        payload
      );
    } else {
      putRecentChatByMessageId(
        undefined,
        partitionKey,
        userId,
        targetId,
        userId,
        payload
      );

      // remove from match
      getMatchByUserPair(partitionKey).then((match) => {
        if (match) {
          deleteMatchById(match.id);
        }
      });
    }

    const recentChatRecipient = items.find(
      (item) => item.recipient_id == userId
    );

    // recipient side does not necessary to have recent chat with author (still in match table)
    if (recentChatRecipient) {
      putRecentChatByMessageId(
        recentChatRecipient.id,
        partitionKey,
        recentChatRecipient.user_id,
        recentChatRecipient.recipient_id,
        userId,
        payload
      );
    }
  });

  res.status(201).end();
}

function subscribeChat(req, res) {
  const userId = req.profile.id;

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  console.log(userId, "connected");

  subscribers[userId] = res;

  req.on("close", () => {
    console.log(userId, "disconnected");
    delete subscribers[userId];
    console.log(subscribers);
  });
}

function validateLastKey(input) {
  const expectedKeys = ["id", "user_pair", "created_date"];
  const isObject =
    typeof input === "object" && input !== null && !Array.isArray(input);

  if (!isObject) {
    return false;
  }

  const keys = Object.keys(input);
  const hasAllExpectedKeys = keys.every((key) => expectedKeys.includes(key));

  if (!hasAllExpectedKeys || keys.length !== expectedKeys.length) {
    return false;
  }

  const idIsValid =
    typeof input.id === "object" &&
    input.id !== null &&
    Object.keys(input.id).includes("S");
  const userPairIsValid =
    typeof input.user_pair === "object" &&
    input.user_pair !== null &&
    Object.keys(input.user_pair).includes("S");
  const createdDateIsValid =
    typeof input.created_date === "object" &&
    input.created_date !== null &&
    Object.keys(input.created_date).includes("N");

  return idIsValid && userPairIsValid && createdDateIsValid;
}

/**
 * emit event to listener if the recipient subsribe
 * @param {Id} recipientId
 * @param {("_message"|"seen")} event
 * @param {object} payload
 */
function emitEvent(recipientId, event, payload) {
  console.log("emiting to", recipientId, {
    event,
    payload,
  });

  if (!(recipientId in subscribers)) {
    console.log("not subscribed");
    return;
  }

  const data = `data: ${JSON.stringify({
    event,
    payload,
  })}\nevent: ${event}\n\n`;

  subscribers[recipientId].write(data);
}

export const chatController = {
  getChat,
  postChat,
  getChats,
  subscribeChat,
};
