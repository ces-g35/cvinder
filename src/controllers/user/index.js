import db from "../../utils/db/index.js";

/**
 * @param {object} body
 */
function validateUsername(body) {
  if (!body.username) {
    throw new Error("Username is required");
  }
}

/**
 * @param {object} body
 */
function validateBirthDate(body) {
  if (!body.birthdate) {
    throw new Error("Birthdate is required");
  }
  if (body.birthdate > Date.now()) {
    throw new Error("Birthdate is not correct");
  }
}

/**
 * @param {object} body
 */
function validateGender(body) {
  if (!body.gender) {
    throw new Error("Gender is required");
  }

  if (body.gender !== "Male" && body.gender !== "Female") {
    throw new Error("Gender is not correct");
  }
}

/**
 * @param {object} body
 */
function validateInterests(body) {
  if (!body.interests) {
    throw new Error("Interests is required");
  }

  if (!Array.isArray(body.interests)) {
    throw new Error("Interests is not an array");
  }

  if (body.interests.length < 5) {
    throw new Error("Interests is less than 5");
  }
}

async function updateUser(req, res) {
  const body = req.body;
  const id = req.profile.id;
  const updatedUser = {};
  try {
    if (body.username) {
      validateUsername(body);
      updatedUser.username = body.username;
    }

    if (body.birthdate) {
      validateBirthDate(body);
      updatedUser.birthdate = body.birthdate;
    }

    if (body.gender) {
      validateGender(body);
      updatedUser.gender = body.gender;
    }

    if (body.interests) {
      validateInterests(body);
      updatedUser.interests = body.interests;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  await db.updateItem("user", id, updatedUser);
  res.sendStatus(204);
}

async function getProfile(req, res) {
  res.json(req.profile);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createUser(req, res) {
  const body = req.body;

  try {
    validateUsername(body);
    validateBirthDate(body);
    validateGender(body);
    validateInterests(body);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    await db.addItem("user", { ...newUser });
    res.sendStatus(201);
  } catch (err) {
    res.status(400).json({ error: "Some thing went wrong" });
  }
}

export default {
  updateUser,
  createUser,
  getProfile,
};
