import db from "../../utils/db/index.js";

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
