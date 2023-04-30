import { getMatchesByUserId } from "../../repositories/match/index.js";
import userRepo from "../../repositories/user/index.js";

/**
 * Controller for get matches route
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getMatches(req, res) {
  const userId = req.profile.id;

  const matches = await getMatchesByUserId(userId);

  for (let i = 0; i < matches.length; i++) {
    console.log(matches[i].user_pair);
    const user = (await userRepo.getUser(matches[i].user_pair)).Item;
    console.log(user);
    matches[i].target_name = user.username;
    matches[i].img_url = user.photos[0];
  }

  console.log(matches);

  const ret = matches.map((match) => {
    return {
      ...match,
    };
  });

  res.json(ret);
}

export default { getMatches };
