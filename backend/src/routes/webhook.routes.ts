import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
} from "../controllers/webhook.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", getWebhooks);
router.post("/", createWebhook);
router.put("/:webhookId", updateWebhook);
router.delete("/:webhookId", deleteWebhook);

export default router;
