/**
 * @param {{cv_cid:number, course_no: string, year:string, semester: number, section: string, role: string}[]} courses
 * @param {string} uid
 * @param {Date} lastUpdated
 * @param {string} prefGender
 * @returns {import('@aws-sdk/lib-dynamodb').ExecuteStatementCommandInput}
 */
export function buildSearchNewUserFromUpdatedCourse(
  courses,
  uid,
  lastUpdated,
  prefGender
) {
  return {
    Statement: `SELECT * FROM courses  WHERE cv_cid IN [${courses
      .map(() => "?")
      .join(",")}] AND NOT student_id = ? AND createdAt > ? AND gender = ?`,
    Parameters: [...courses.map((c) => c.cv_cid), uid, lastUpdated, prefGender],
  };
}
