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

export const userControllers = {
  updateInterests,
  updateGender,
  updateBirthDate,
  updateUsername,
};
