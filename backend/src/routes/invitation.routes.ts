import { Router } from "express";
import {
  getUserInvitations,
  acceptInvitation,
  declineInvitation,
} from "../controllers/collaborator.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getUserInvitations);
router.post("/:inviteId/accept", acceptInvitation);
router.post("/:inviteId/decline", declineInvitation);

export default router;
