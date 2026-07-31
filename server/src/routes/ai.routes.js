import express from "express";
import { generateTaskDescription, generateProjectSummary } from "../controllers/ai.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Both AI features live together here under one /api/ai prefix — a
// single, obvious place to look for "everything AI-related" as more
// AI features get added later.
router.post("/task-description", protect, generateTaskDescription);
router.post("/projects/:projectId/summary", protect, generateProjectSummary);

export default router;