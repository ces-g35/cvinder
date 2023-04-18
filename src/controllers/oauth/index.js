import dotenv from "dotenv";
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
  res.redirect(
    `/interests/?access_token=${response.access_token}&refresh_token=${response.refresh_token}`
  );
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function refreshToken(req, res) {
  //TODO: Implement refresh token
}

export const oauthControllers = {
  oauthLogin,
  token,
  refreshToken,
};
