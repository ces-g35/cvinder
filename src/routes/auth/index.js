import { Router } from "express";
import { oauthControllers } from "../../controllers/oauth/index.js";

const router = Router();

router.get("/login", oauthControllers.oauthLogin);
router.post("/refresh", oauthControllers.refreshToken);

export default router;
