import dotenv from "dotenv";
import userRepo from "../../repositories/user/index.js";
import cvClient from "../../client/courseville/index.js";
dotenv.config();

const OAUTH_TOKEN_URL = "https://www.mycourseville.com/api/oauth/access_token";
const redirect_uri = `http://${process.env.URL}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirect_uri}`;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function oauthLogin(_req, res) {
  res.redirect(authorization_url);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function token(req, res) {
  const { code } = req.query;
  if (!code) {
    res.status(400).json({ error: "No token provided" });
    return;
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri,
  });

  const options = {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const response = await (await fetch(OAUTH_TOKEN_URL, options)).json();
  // res.json(response);
  req.session.accessToken = response.access_token;
  req.session.refreshToken = response.refresh_token;
  req.session.expiresAt = Date.now() + response.expires_in;
  const profile = await cvClient.getProfile(req.session.accessToken);
  let is_new = await userRepo.isNewUser(profile.id);
  res.redirect(`/about?is_new=${is_new}`);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function refreshToken(req, res) {
  //TODO: Implement refresh token
}

export default {
  oauthLogin,
  token,
  refreshToken,
};
