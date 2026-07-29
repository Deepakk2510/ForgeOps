import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createIssue,
  getRepositoryIssues,
  updateIssue,
  deleteIssue,
} from "../controllers/issue.controller.js";

const router = Router();

// Create Issue
router.post("/", authenticate, createIssue);

// Get Repository Issues
router.get(
  "/repository/:repositoryId",
  authenticate,
  getRepositoryIssues
);

// Update Issue
router.put("/:id", authenticate, updateIssue);

// Delete Issue
router.delete("/:id", authenticate, deleteIssue);

export default router;