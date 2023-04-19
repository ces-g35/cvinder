import dotenv from 'dotenv';
import { createJwt, verifyJwt } from '../../utils/jwt/index.js';

dotenv.config();

const OAUTH_TOKEN_URL = 'https://www.mycourseville.com/api/oauth/access_token';
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
    res.status(400).json({ error: 'No token provided' });
    return;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri,
  });

  const options = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const { access_token, expires_in, refresh_token } = await (
    await fetch(OAUTH_TOKEN_URL, options)
  ).json();
  const jwtAccesstoken = await createJwt({}, { access_token }, expires_in);
  const jwtRefreshtoken = await createJwt({}, { refresh_token }, expires_in);
  res.json({ jwtAccesstoken, jwtRefreshtoken });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function refreshToken(req, res) {
  // TODO: Implement refresh token
}

export const oauthControllers = {
  oauthLogin,
  token,
  refreshToken,
};
