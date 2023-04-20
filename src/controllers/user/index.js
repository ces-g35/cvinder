import db from "../../utils/db/index.js";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createUser(req, res) {
  const body = req.body;
  if (!body.username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  if (!body.birthdate) {
    res.status(400).json({ error: "Birthdate is required" });
    return;
  }

  if (!body.gender) {
    res.status(400).json({ error: "Gender is required" });
    return;
  }

  if (body.gender !== "Male" && body.gender !== "Female") {
    res.status(400).json({ error: "Gender is not correct" });
    return;
  }

  if (!body.interests) {
    res.status(400).json({ error: "Interests is required" });
    return;
  }

  if (!Array.isArray(body.interests)) {
    res.status(400).json({ error: "Interests is not an array" });
    return;
  }

  if (body.interests.length < 5) {
    res.status(400).json({ error: "Interests is less than 5" });
    return;
  }

  const id = req.profile.id;
  const newUser = {
    id,
    username: body.username,
    birthdate: body.birthdate,
    gender: body.gender,
    interests: body.interests,
  };

  try {
    const result = await db.addItem("user", { ...newUser });
    res.sendStatus(201);
  } catch (err) {
    res.status(400).json({ error: "Some thing went wrong" });
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateUsername(req, res) {
  //TODO: Implement update username
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateBirthDate(req, res) {
  //TODO: Implement update birthdate
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateGender(req, res) {
  //TODO: Implement update gender
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateInterests(req, res) {
  //TODO: Implement update interests
}

async function getProfile(req, res) {
  res.json(req.profile);
}

export default {
  updateInterests,
  updateGender,
  updateBirthDate,
  updateUsername,
  getProfile,
  createUser,
};
