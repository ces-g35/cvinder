import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as cors from "cors";
dotenv.config();
const app = express();

let port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`);
});
