/**
 * Controller for get matches route
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getMatches(req, res) {
  res.status(405).json({
    message: "Yang mai implement kub",
  });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function postMatch(req, res) {
  res.status(405).json({
    message: "Yang mai implement kub",
  });
}

export default { postMatch, getMatches };
