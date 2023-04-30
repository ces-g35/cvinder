import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import db, { docClient } from "../../utils/db/index.js";

/**
 * record match in match table
 * @param {Id} userId
 * @returns {Promise<Array<MatchView>>}
 */
export async function addMatch(userId, userPair) {
  const putBuilder = (user_id, user_pair) => ({
    Put: {
      TableName: "match",
      Item: {
        id: `${user_id}-${user_pair}`,
        user_id,
        user_pair,
        created_date: Date.now(),
      },
    },
  });

  const param = {
    TransactItems: [putBuilder(userId, userPair), putBuilder(userPair, userId)],
  };

  await docClient.send(new TransactWriteCommand(param));
  return;
}

/**
 * Get all matches that user has not start chat with
 * @param {Id} userId
 * @returns {Promise<Array<MatchView>>}
 */
export async function getMatchesByUserId(userId) {
  const res = await db.simpleQuery("match", "user_id", userId, {
    indexName: "user_id-created_date-index",
    ascending: false,
  });

  return db.flattenItems(res.Items);
}

/**
 * Get single match that user has not start chat with
 * @param {UserPair} userPair - user pair that used to find
 * @returns {Promise<MatchView>}
 */
export async function getMatchByUserPair(userPair) {
  const res = await db.simpleQuery("match", "user_pair", userPair, {
    indexName: "user_pair-index",
  });

  const parsed = db.flattenItems(res.Items);

  return parsed.length == 0 ? null : parsed[0];
}

/**
 * Delete match by match id
 * @param {Id} id - id of match to be deleted
 */
export async function deleteMatchById(id) {
  await db.deleteItem("match", { id: id });
}
