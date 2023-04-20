import { Router } from "express";
import userControllers from "../../controllers/user/index.js";

const router = Router();

router.get("/me", userControllers.getProfile);
router.post("/", userControllers.createUser);
router.patch("/", userControllers.updateUser);

export default router;
