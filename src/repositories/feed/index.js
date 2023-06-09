import cvClient from "../../client/courseville/index.js";
import {
  ExecuteStatementCommand,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../utils/db/index.js";
import { buildSearchNewUserFromUpdatedCourse } from "../../utils/feed/index.js";

/**
 * @param {string} uid
 * @param {string} prefGender
 * @param {string} accessToken
 * @param {Date} lastUpdated
 */
async function feedBuilder(uid, prefGender, accessToken, lastUpdated) {
  const courses = await cvClient.getCourses(accessToken);

  /** @type {Set<string>} */
  const s = new Set();
  let NextToken, result;
  do {
    const findNewUserStatement = buildSearchNewUserFromUpdatedCourse(
      courses,
      uid,
      lastUpdated,
      prefGender
    );

    findNewUserStatement.NextToken = NextToken;
    result = await docClient.send(
      new ExecuteStatementCommand(findNewUserStatement)
    );

    if (result.Items === undefined) return [];
    result.Items.forEach((item) => s.add(item.student_id));
    NextToken = result.NextToken;
  } while (result.NextToken);

  const updateLastUpdatedStatement = {
    Statement: 'UPDATE "user" SET lastUpdatedAt = ? WHERE id = ?',
    Parameters: [Date.now(), uid],
  };

  await docClient.send(new ExecuteStatementCommand(updateLastUpdatedStatement));

  // update new user to user-feed
  if (s.size !== 0) {
    /** @type {import('@aws-sdk/lib-dynamodb').TransactWriteCommandInput} */
    const param = {
      TransactItems: [],
    };

    Array.from(s).forEach((id) => {
      param.TransactItems.push({
        Put: {
          TableName: "user-feed",
          Item: {
            uid,
            id,
            status: "None",
          },
        },
      });
    });
    await docClient.send(new TransactWriteCommand(param));
  }

  return (
    await docClient.send(
      new ExecuteStatementCommand({
        TableName: "user-feed",
        Statement:
          "SELECT * FROM \"user-feed\" WHERE uid = ? AND status = 'None'",
        Parameters: [uid],
        Limit: 10,
      })
    )
  ).Items;
}

/**
 * @param {string} uid
 * @param {string} id
 */
async function isMatchAndMarkMatched(uid, id) {
  /**@type {import('@aws-sdk/lib-dynamodb').QueryCommandInput} */
  const param = {
    TableName: "user-feed",
    Statement:
      'SELECT * FROM "user-feed" WHERE uid = ? AND id = ? AND status = ?',
    Parameters: [id, uid, "Like"],
  };

  const result = await docClient.send(new ExecuteStatementCommand(param));
  return result.Items.length !== 0;
}

async function makeStatus(uid, id, status) {
  /**@type {import('@aws-sdk/lib-dynamodb').UpdateCommandInput} */
  const updateParam = {
    TableName: "user-feed",
    Key: {
      uid,
      id,
    },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": status,
    },
    ConditionExpression: "attribute_exists(uid) AND attribute_exists(id)",
  };
  await docClient.send(new UpdateCommand(updateParam));
}

async function getMatches(uid) {
  /**@type {import('@aws-sdk/lib-dynamodb').ExecuteStatementCommandInput} */
  const param = {
    TableName: "user-feed",
    Statement:
      "SELECT * FROM \"user-feed\" WHERE uid = ? AND status = 'Matched'",
    Parameters: [uid],
  };

  return (await docClient.send(new ExecuteStatementCommand(param))).Items;
}

export default {
  feedBuilder,
  isMatchAndMarkMatched,
  makeStatus,
  getMatches,
};
