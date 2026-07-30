import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Google DNS to bypass mobile hotspot blocks

import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();