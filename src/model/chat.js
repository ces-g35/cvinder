/**
 * @typedef {object} RecentChat
 * @property {Id} id
 * @property {number} created_date
 * @property {UserPair} user_pair
 * @property {Id} user_id
 * @property {Id} recipient_id
 * @property {Id} author
 * @property {string} recipient_name
 * @property {string} message
 * @property {boolean} seen
 */

/**
 * @typedef {object} Chat
 * @property {Id} id
 * @property {Id} author
 * @property {number} created_date
 * @property {string} message
 * @property {boolean} seen
 * @property {UserPair} user_pair
 */

/**
 * UserPair is type alias for string
 * which is format as `<user1 id>:<user2 id>`
 * where user1 < user2
 * @typedef {string} UserPair
 */

/**
 * Id is type alias for string
 * format as ???
 * @typedef {string} Id
 */

/**
 *
 * @typedef {object} ChatEvent
 * @property {("message"|"seen")} eventType
 * @property {Payload} payload - structure depend on eventType
 */
