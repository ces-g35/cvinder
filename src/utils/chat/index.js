/**
 * @description Get partition key
 * @param {string} userId1 first user
 * @param {string} userId2 second user
 * @returns {string} partition key
 */
export function getPartitionKey(userId1, userId2) {
  return userId1 < userId2 ? `${userId1}:${userId2}` : `${userId2}:${userId1}`;
}

/**
 * @description encode string
 * @param {string} data
 * @returns {string} encoded data
 */
export function encodeBase64(data) {
  return Buffer.from(data).toString("base64");
}

/**
 * @description decode string
 * @param {string} encodedData
 * @returns {string} decoded data
 */
export function decodeBase64(data) {
  return Buffer.from(data, "base64").toString("ascii");
}
