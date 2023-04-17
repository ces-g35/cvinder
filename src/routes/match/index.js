import { Router } from "express";
import matchControllers from "../../controllers/match/index.js";

const router = Router();

router.get("", matchControllers.getMatches);
router.post("/:id", matchControllers.postMatch);

export default router;
