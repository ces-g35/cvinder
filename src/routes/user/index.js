import { Router } from "express";
import userControllers from "../../controllers/user/index.js";

const router = Router();

router.get("/me", userControllers.getProfile);
router.post("/", userControllers.createUser);

export default router;
