import { Router } from "express";
import { getFiles, getFileContent, seedFiles } from "../controllers/file.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", getFiles);
router.post("/seed", seedFiles);
router.get("/:fileId/content", getFileContent);

export default router;
