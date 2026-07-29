import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  closePullRequest,
  createPullRequest,
  deletePullRequest,
  getRepositoryPullRequests,
  mergePullRequest,
  reviewPullRequest,
  reopenPullRequest,
  updatePullRequest,
} from "../controllers/pull-request.controller.js";

const router = Router();

router.post("/", authenticate, createPullRequest);
router.get("/repository/:repositoryId", authenticate, getRepositoryPullRequests);
router.post("/:id/reviews", authenticate, reviewPullRequest);
router.post("/:id/merge", authenticate, mergePullRequest);
router.post("/:id/close", authenticate, closePullRequest);
router.post("/:id/reopen", authenticate, reopenPullRequest);
router.put("/:id", authenticate, updatePullRequest);
router.delete("/:id", authenticate, deletePullRequest);

export default router;
