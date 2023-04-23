import cvClient from "../../client/courseville/index.js";
import { ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../utils/db/index.js";

/**
 * @param {string} uid
 * @param {string} genderPref
 * @param {string} accessToken
 */
async function feedBuilder(uid, genderPref, accessToken) {
  const courses = await cvClient.getCourses(accessToken);
  const c = [];
  courses.forEach((course) => {
    c.push(
      docClient.send(
        new ExecuteStatementCommand({
          Statement: "SELECT * FROM course WHERE ",
          Parameters: [{ S: course.cv_cid }],
        })
      )
    );
  });
}
