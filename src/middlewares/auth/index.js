import client from "../../client/courseville/index.js";
import db from "../../utils/db/index.js";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authMiddleware(req, res, next) {
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function isUserMiddleware(req, res, next) {
  if (req.originalUrl.startsWith("/api/user") && req.method === "POST") {
    next();
    return;
  }

  const id = req.profile.id;
  const user = await db.getItem("user", { id });
  if (!user.Item) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export default {
  authMiddleware,
  isUserMiddleware,
};
