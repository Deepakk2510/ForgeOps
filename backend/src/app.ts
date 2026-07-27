import express from "express";
import cors from "cors";
import repositoryRoutes from "./routes/repository.routes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/repositories", repositoryRoutes);

// Health Check Route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ForgeOps Backend is Running!",
  });
});

export default app;