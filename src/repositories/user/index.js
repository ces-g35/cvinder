import db from "../../utils/db/index.js";
async function isNewUser(id) {
  const dbResposne = await db.getItem("user", { id });
  console.log(dbResposne);
  const user = dbResposne.Item;
  return !user;
}

export default {
  isNewUser,
};
