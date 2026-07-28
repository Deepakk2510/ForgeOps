import express from "express";
import cors from "cors";

import repositoryRoutes from "./routes/repository.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ForgeOps Backend is Running!",
  });
});


export default app;