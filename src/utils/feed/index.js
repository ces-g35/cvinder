import cvClient from "../../client/courseville/index.js";
import { ExecuteStatementCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../utils/db/index.js";

/**
 * @param {string} uid
 * @param {string} prefGender
 * @param {string} accessToken
 *@param {Date} lastUpdated
 */
async function feedBuilder(uid, prefGender, accessToken, lastUpdated) {
  const courses = await cvClient.getCourses(accessToken);
  /** @type {import('@aws-sdk/lib-dynamodb').ExecuteStatementCommandInput} */
  const statement = {
    Statement: `SELECT * FROM courses  WHERE cv_cid IN [${courses
      .map(() => "?")
      .join(",")}] AND NOT student_id = ? AND createdAt > ? AND gender = ?`,
    Parameters: [...courses.map((c) => c.cv_cid), uid, lastUpdated, prefGender],
  };

  const statement2 = {
    Statement: 'UPDATE "user" SET lastUpdatedAt = ? WHERE id = ?',
    Parameters: [Date.now(), uid],
  };
  // const statement = {
  //   Statement: "SELECT * FROM courses",
  // };
  console.log(JSON.stringify(statement, null, 2));
  const [result] = await Promise.all([
    docClient.send(new ExecuteStatementCommand(statement)),
    docClient.send(new ExecuteStatementCommand(statement2)),
  ]);

  const items = result.Items;
  const s = new Set();
  items.forEach((item) => s.add(item.student_id));

  /** @type {import('@aws-sdk/lib-dynamodb').UpdateCommandInput} */
  const param = {
    TableName: "user-feed",
    Key: {
      uid,
    },
    UpdateExpression:
      "SET feed = list_append(if_not_exists(feed, :emptyList), :newUser)",
    ExpressionAttributeValues: {
      ":newUser": [...s],
      ":emptyList": [],
    },
  };
  await docClient.send(new UpdateCommand(param));
  return s;
}

export default {
  feedBuilder,
};
