import { getMatchesByUserId } from "../../repositories/match/index.js";

/**
 * Controller for get matches route
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getMatches(req, res) {
  const userId = req.profile.id;

  const matches = await getMatchesByUserId(userId);

  // TODO: add correct name and img url
  const ret = matches.map((match) => {
    return {
      img_url: "/icons/user-bottom.svg",
      target_name: "name: " + match.target_id,
      ...match,
    };
  });

  res.json(ret);
}

export default { getMatches };
