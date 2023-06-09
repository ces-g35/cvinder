import { Router } from "express";
import userControllers from "../../controllers/user/index.js";

const router = Router();

router.get("/me", userControllers.getProfile);
router.post("/", userControllers.createUser);
router.patch("/", userControllers.updateUser);
router.get("/courses", userControllers.getUserCourses);
router.get("/feed", userControllers.getFeed);
router.get("/:id", userControllers.getUser);
router.post("/upload", userControllers.uploadFile);
router.get("/image/:key", userControllers.getFile);
router.post("/swipe", userControllers.makeSwipe);
router.post("/mathes", userControllers.getMathesUser);
router.patch("/bio", userControllers.updateBio);
router.get("/logout", userControllers.logout);

export default router;
