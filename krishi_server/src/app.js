/**
 * Krishi Mama API — Express application.
 * Mounts middleware and the versioned REST API under /api/v1.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.config.js";
import apiV1Routes from "./routes/v1/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/requestLogger.js";

export function createApp() {
  const app = express();

  // ---- Core middleware ----
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  // ---- Credentialed CORS ----
  const configuredOrigins = Array.isArray(env.corsOrigin) ? env.corsOrigin : [env.corsOrigin];
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
    ...configuredOrigins,
  ]);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (env.nodeEnv === "development" || env.nodeEnv === "test" || allowedOrigins.has(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    })
  );

  // ---- Logging ----
  app.use(requestLogger);

  // ---- Root welcome & status endpoint ----
  app.get("/", (_req, res) => {
    return res.status(200).json({
      success: true,
      name: "Krishi Mama API (কৃষি মামা)",
      version: "1.0.0",
      status: "online",
      message: "Welcome to Krishi Mama API. The backend service is active and running.",
      documentation: "https://github.com/mahjabin-alif-lamiya/krishi-mama",
      endpoints: {
        health: "/api/v1/health",
        districts: "/api/v1/districts",
        climateSummary: "/api/v1/climate/summary?district=cumilla",
        soilMoisture: "/api/v1/soil-moisture/latest?district=cumilla",
        vegetation: "/api/v1/vegetation/latest?district=cumilla",
        cropCalendar: "/api/v1/crop-calendar",
        authGoogleStatus: "/api/v1/auth/google/status",
      },
    });
  });

  // ---- Versioned API ----
  app.use("/api/v1", apiV1Routes);

  // ---- 404 + centralized errors ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
