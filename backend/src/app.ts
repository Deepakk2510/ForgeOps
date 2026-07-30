import express from "express";
import cors from "cors";

import repositoryRoutes from "./routes/repository.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import pullRequestRoutes from "./routes/pull-request.routes.js";
import versionControlRoutes from "./routes/version-control.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/pull-requests", pullRequestRoutes);
app.use("/api/version-control", versionControlRoutes);
app.use("/api/repositories/:repositoryId/files", fileRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ForgeOps Backend is Running!",
  });
});

export default app;
