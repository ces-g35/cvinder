import express from "express";
import session from "express-session";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import cors from "cors";
import routes from "./routes/index.js";
import oauthControllers from "./controllers/oauth/index.js";
import middlewares from "./middlewares/index.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionOptions = {
  secret: process.env.SECRET || "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    // setting this false for http connections
    secure: false,
    httpOnly: true,
  },
};

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(session(sessionOptions));

const router = express.Router();

app.get("/courseville/access_token", oauthControllers.token);
app.use("/api", router);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.use("/auth", routes.authRoute);
router.use(
  "/user",
  middlewares.authMiddleware.authMiddleware,
  middlewares.authMiddleware.isUserMiddleware,
  routes.userRoute
);

const rootRouter = express.Router();

const buildPath = path.normalize(path.join(__dirname, "../dist"));
app.use(express.static(buildPath));

rootRouter.get("(/*)?", async (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
app.use(rootRouter);

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`);
});
