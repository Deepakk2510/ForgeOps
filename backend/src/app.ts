import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import repositoryRoutes from "./routes/repository.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import pullRequestRoutes from "./routes/pull-request.routes.js";
import versionControlRoutes from "./routes/version-control.routes.js";
import fileRoutes from "./routes/file.routes.js";
import collaboratorRoutes from "./routes/collaborator.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/pull-requests", pullRequestRoutes);
app.use("/api/version-control", versionControlRoutes);
app.use("/api/repositories/:repositoryId/files", fileRoutes);
app.use("/api/repositories", collaboratorRoutes);
app.use("/api/repositories/:repositoryId/webhooks", webhookRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/repositories/:repositoryId", aiRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ForgeOps Backend is Running!",
  });
});

export default app;
