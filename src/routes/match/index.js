import { Router } from "express";
import matchControllers from "../../controllers/match/index.js";

const router = Router();

router.get("", matchControllers.getMatches);

export default router;
