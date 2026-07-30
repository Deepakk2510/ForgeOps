import { Router } from "express";
import { login, register, githubCallback } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/github", githubCallback);

export default router;