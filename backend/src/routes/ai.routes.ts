import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { generatePRDescription, generatePRReview, generateCommitMessage, handleAIChat } from "../controllers/ai.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/chat", handleAIChat);
router.post("/branches/:branchName/ai-pr-description", generatePRDescription);
router.post("/branches/:branchName/ai-commit-message", generateCommitMessage);
router.post("/pull-requests/:pullRequestId/ai-review", generatePRReview);

export default router;
