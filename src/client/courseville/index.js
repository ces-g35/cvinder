/**
 * @param {string} accessToken
 * @returns {Promise<{id: string, title_en: string?, firstname_en: string?, lastname_en: string?, title_th: string?, firstname_th: string?, lastname_th: string?}>} user profile
 */
async function getProfile(accessToken) {
  const profileOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const profile = await (
    await fetch(
      "https://www.mycourseville.com/api/v1/public/users/me",
      profileOptions
    )
  ).json();
  return profile.user;
}

/**
 * @param {string} accessToken
 * @returns {Promise<[{cv_cid:number, course_no: string, year:string, semester: number, section: string, role: string}]>} user courses
 */
async function getCourses(accessToken) {
  // You should change the response below.
  if (process.env.NODE_ENV === "development")
    return (await import("./mock_course.js")).default;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const courses = await (
    await fetch(
      "https://www.mycourseville.com/api/v1/public/get/user/courses",
      options
    )
  ).json();
  return courses.data.student;
}

export default {
  getProfile,
  getCourses,
};
