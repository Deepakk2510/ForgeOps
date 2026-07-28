import { Router } from "express";
import {
  createRepository,
  getRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
} from "../controllers/repository.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createRepository);
router.get("/", authenticate, getRepositories);
router.get("/:id", authenticate, getRepositoryById);
router.put("/:id", authenticate, updateRepository);
router.delete("/:id", authenticate, deleteRepository);

export default router;