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

export default {
  getProfile,
};
