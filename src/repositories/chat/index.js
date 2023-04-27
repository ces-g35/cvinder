import db from "../../utils/db/index.js";

/**
 * @param {Id} userId
 * @return {Promise<Array<RecentChat>>}
 */

export async function getRecentChats(userId) {
  const response = await db.simpleQuery("recent_chat", "user_id", userId, {
    indexName: "user_id-created_date-index",
    ascending: false,
  });

  const parsedItem = db.flattenItems(response.Items);

  return parsedItem;
}

/**
 * @param {UserPair} userPair
 * @return {Promise<PaginateQuery<Chat>>}
 */
export async function getChatByUserPair(userPair, lastKey = undefined) {
  const response = await db.simpleQuery("chat", "user_pair", userPair, {
    limit: 20,
    indexName: "user_pair-created_date-index",
    ascending: false,
    startKey: lastKey,
  });

  const result = {
    data: db.flattenItems(response.Items),
    metadata: {},
  };

  if (response.LastEvaluatedKey) {
    result.metadata.LastEvaluatedKey = response.LastEvaluatedKey;
  }

  return result;
}

/**
 * @param {UserPair} userPair
 * @return {Promise<Array<RecentChat>>}
 */
export async function getRecentChatByUserPair(userPair) {
  const response = await db.simpleQuery("recent_chat", "user_pair", userPair, {
    indexName: "user_pair-index",
  });

  const parsedItem = db.flattenItems(response.Items);

  return parsedItem;
}

/**
 * @param {UserPair} userPair
 * @param {string} author
 * @param {string} payload
 */
export async function pushMessage(userPair, author, payload) {
  const response = db.addItem("chat", {
    user_pair: userPair,
    author,
    payload,
    seen: false,
  });

  return response;
}

/**
 * @param {Id} messageId
 * @param {UserPair} userPair
 * @param {Id} author
 * @param {Id} recipientId
 * @param {Id} userId
 * @param {string} message
 */
export async function putRecentChatByMessageId(
  id,
  userPair,
  userId,
  recipientId,
  author,
  message
) {
  const data = {
    user_pair: userPair,
    recipient_id: recipientId,
    seen: false,
    user_id: userId,
    author,
    message,
  };

  if (id) {
    data.id = id;
  }

  await db.addItem("recent_chat", data);
}
