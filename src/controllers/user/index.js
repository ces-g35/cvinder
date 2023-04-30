import cvClient from "../../client/courseville/index.js";
import { v4 as uuid } from "uuid";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../utils/db/index.js";
import path from "path";
import { promises as fs, existsSync } from "fs";
import feedRepo from "../../repositories/feed/index.js";
import { addMatch } from "../../repositories/match/index.js";
import userRepo from "../../repositories/user/index.js";
import db from "../../utils/db/index.js";

const imageStorage = path.join(process.cwd(), "images");
if (!existsSync(imageStorage)) {
  fs.mkdir(imageStorage);
}

/**
 * @param {object} body
 */
function validateUsername(body) {
  if (!body.username) {
    throw new Error("Username is required");
  }
}

function validateBio(body) {
  if (!body.bio) {
    throw new Error("Bio is required");
  }

  if (body.bio.length > 200) {
    throw new Error("Bio is too long");
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

/**
 * @param {object} body
 */
function validateGender(body) {
  if (!body.prefGender) {
    throw new Error("PrefGender is required");
  }

  if (body.prefGender !== "Male" && body.prefGender !== "Female") {
    throw new Error("PrefGender is not correct");
  }
}

/**
 * @param {object} body
 */
function validatePhotos(body) {
  if (!body.photos) {
    throw new Error("Photos is required");
  }

  if (body.photos.length < 2) {
    throw new Error("Photos is need to be more than 1");
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

    if (body.prefGender) {
      validateGender(body);
      updatedUser.prefGender = body.prefGender;
    }

    if (body.bio) {
      validateBio(body);
      updatedUser.bio = body.bio;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  console.log(updatedUser, id);
  await db.updateItem("user", id, updatedUser);
  res.sendStatus(204);
}

async function getProfile(req, res) {
  res.json(req.user);
}

/**
 * @param {string[]} photos
 */
async function saveImage(photos) {
  const imageDir = path.join(process.cwd(), "images");
  return Promise.all(
    photos.map((photo) => {
      const key = uuid();
      const filePath = path.join(imageDir, key);
      fs.writeFile(filePath, photo, "base64");
    })
  );
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createUser(req, res) {
  const body = req.body;
  const accessToken = req.session.accessToken;

  try {
    validateUsername(body);
    validateBirthDate(body);
    validateGender(body);
    validateInterests(body);
    validateGender(body);
    validatePhotos(body);
    validateBio(body);
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }

  const id = req.profile.id;
  const newUser = {
    id,
    photos: body.photos,
    username: body.username,
    birthdate: body.birthdate,
    gender: body.gender,
    interests: body.interests,
    prefGender: body.prefGender,
    bio: body.bio,
    lastUpdatedAt: 0,
  };

  try {
    const Item = { id: uuid(), ...newUser };
    Item.created_date = Date.now();
    const courses = await cvClient.getCourses(accessToken);

    /** @type {import('@aws-sdk/lib-dynamodb').TransactWriteCommandInput} */
    const transactionCommandInput = {
      TransactItems: [
        {
          Put: {
            TableName: "user",
            Item,
          },
        },
      ],
    };

    const createdAt = Date.now();
    courses.forEach(async (course) => {
      transactionCommandInput.TransactItems.push({
        Put: {
          TableName: "courses",
          Item: {
            cv_cid: course.cv_cid,
            student_id: id,
            gender: body.gender,
            createdAt,
          },
        },
      });
    });

    await docClient.send(new TransactWriteCommand(transactionCommandInput));
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some thing went wrong" });
    return;
  }
}

async function getUserCourses(req, res) {
  const accessToken = req.session.accessToken;
  const courses = await cvClient.getCourses(accessToken);
  res.json(courses);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getFeed(req, res) {
  const id = req.profile.id;
  const accessToken = req.session.accessToken;

  const result = await feedRepo.feedBuilder(
    id,
    req.user.prefGender,
    accessToken,
    req.user.lastUpdatedAt
  );
  const withUser = await Promise.all(
    result.map(async (item) => ({
      id: item.id,
      user: (await userRepo.getUser(item.id)).Item,
    }))
  );
  res.json(withUser);
}

async function uploadFile(req, res) {
  console.log(req.body);
  const key = uuid();
  const filePath = path.join(imageStorage, key);
  fs.writeFile(filePath, req.body.base64File, "utf-8");
  res.json({ key });
}

async function getFile(req, res) {
  const filePath = path.join(imageStorage, req.params.key);
  try {
    const file = (await fs.readFile(filePath)).toString("utf-8");
    const contentType = file.split(";")[0].split(":")[1];
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(file.split(",")[1], "base64"));
  } catch (error) {
    res.status(404).send("File not found");
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function makeSwipe(req, res) {
  const uid = req.profile.id;
  const { id, status } = req.body;

  try {
    await feedRepo.makeStatus(uid, id, status);
    if (status !== "Like") {
      res.sendStatus(204);
      return;
    }

    const isMatched = await feedRepo.isMatchAndMarkMatched(uid, id);
    if (!isMatched) {
      res.sendStatus(204);
      return;
    }

    await feedRepo.makeStatus(id, uid, "Matched");
    await feedRepo.makeStatus(uid, id, "Matched");
    await addMatch(uid, id);
    res.json({
      status: "Matched",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "something went wrong" });
  }
}

async function getMathesUser(req, res) {
  const uid = req.profile.id;
  try {
    res.json(await feedRepo.getMatches(uid));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "something went wrong" });
  }
}

async function getUser(req, res) {
  const uid = req.params.id;
  try {
    res.json((await userRepo.getUser(uid)).Item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "something went wrong" });
  }
}

export default {
  updateUser,
  createUser,
  getProfile,
  getUserCourses,
  getFeed,
  uploadFile,
  getFile,
  makeSwipe,
  getMathesUser,
  getUser,
};
