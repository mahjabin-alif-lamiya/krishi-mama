import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import healthRouter from "./routes/health.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "krishi-mama-api",
    status: "running",
    docs: "/api/health",
  });
});

app.use("/api/health", healthRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  if (process.env.MONGODB_URI) {
    await connectDB(process.env.MONGODB_URI);
  } else {
    console.warn("MONGODB_URI is not set - starting without a database connection.");
  }

  app.listen(PORT, () => {
    console.log(`krishi-mama-api listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
