import { chatController } from "../../controllers/chat/index.js";
import { Router } from "express";

const router = Router();

router.get("", chatController.getChats);
router.get("/subscribe", chatController.subscribeChat);
router.get("/:id", chatController.getChat);
router.post("/:id", chatController.postChat);

export default router;
