import { ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import db, { docClient } from "../../utils/db/index.js";
async function isNewUser(id) {
  const dbResposne = await db.getItem("user", { id });
  console.log(dbResposne);
  const user = dbResposne.Item;
  return !user;
}

/**
 * @param {string} id
 */
function getUser(id) {
  return db.getItem("user", { id });
}

function updateBio(id, bio) {
  console.log(id, bio);
  return docClient.send(
    new ExecuteStatementCommand({
      Statement: `UPDATE "user" SET bio = ? WHERE id = ?`,
      Parameters: [{ S: bio }, { S: id }],
    })
  );
}

export default {
  isNewUser,
  getUser,
  updateBio,
};
