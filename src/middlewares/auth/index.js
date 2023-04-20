import client from "../../client/courseville/index.js";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default async function authMiddleware(req, res, next) {
  const accessToken = req.session.accessToken;
  const expiresAt = req.session.expiresAt;

  if (!accessToken || !expiresAt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (expiresAt < Date.now()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const profile = await client.getProfile(accessToken);
    req.profile = profile;
    next();
    return;
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
}
