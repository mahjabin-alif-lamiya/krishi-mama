/**
 * Assistant Routes — /api/v1/assistant
 * Handles conversational assistant interactions and authenticated chat history.
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  chatWithAssistant,
  transcribeAssistantAudio,
  generateAssistantSpeech,
  listConversations,
  getConversation,
  renameConversation,
  deleteConversation,
} from "../../controllers/assistant.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/auth.middleware.js";
import { env } from "../../config/env.config.js";

const router = Router();

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40, // 40 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.nodeEnv === "test",
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many assistant chat requests. Please slow down.",
    },
  },
});

const transcriptionRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.nodeEnv === "test",
  message: {
    success: false,
    error: { code: "TOO_MANY_TRANSCRIPTIONS", message: "Too many voice transcription requests. Please try again shortly." },
  },
});

const speechRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.nodeEnv === "test",
  message: { success: false, error: { code: "TOO_MANY_SPEECH_REQUESTS", message: "Too many speech requests. Please try again shortly." } },
});

// Conversations Management (Authenticated)
router.get("/conversations", authenticate, listConversations);
router.get("/conversations/:id", authenticate, getConversation);
router.patch("/conversations/:id", authenticate, renameConversation);
router.delete("/conversations/:id", authenticate, deleteConversation);

// Assistant use and private history are available after login.
router.post("/chat", authenticate, chatRateLimiter, chatWithAssistant);
router.post("/transcribe", optionalAuthenticate, transcriptionRateLimiter, transcribeAssistantAudio);
router.post("/speech", optionalAuthenticate, speechRateLimiter, generateAssistantSpeech);

export default router;
