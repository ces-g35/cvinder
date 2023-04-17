import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import cors from "cors";
import { routes } from "./routes/index.js";
import { oauthControllers } from "./controllers/oauth/index.js";
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

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use("/auth", routes.authRoute);
app.get("/courseville/access_token", oauthControllers.token);

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`);
});
