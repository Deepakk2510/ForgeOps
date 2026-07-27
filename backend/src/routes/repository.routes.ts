import { Router } from "express";
import {
  createRepository,
  getRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
} from "../controllers/repository.controller.js";

const router = Router();

router.post("/", createRepository);
router.get("/", getRepositories);
router.get("/:id", getRepositoryById);
router.put("/:id", updateRepository);
router.delete("/:id", deleteRepository);

export default router;