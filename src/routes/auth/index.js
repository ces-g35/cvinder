import { Router } from "express";
import { oauthControllers } from "../../controllers/oauth/index.js";

const router = Router();

router.get("/login", oauthControllers.oauthLogin);

export default router;
