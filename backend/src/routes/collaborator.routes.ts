import { Router } from "express";
import {
  addCollaborator,
  getCollaborators,
  updateCollaboratorRole,
  removeCollaborator,
} from "../controllers/collaborator.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.route("/")
  .get(getCollaborators)
  .post(addCollaborator);

router.route("/:collaboratorId")
  .patch(updateCollaboratorRole)
  .delete(removeCollaborator);

export default router;
