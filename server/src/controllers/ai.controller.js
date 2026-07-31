import ai from "../utils/geminiClient.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Centralizing the model name in one constant means upgrading to a
// newer Gemini model later is a one-line change, not a find-and-replace
// across every AI feature.
const GEMINI_MODEL = "gemini-3.5-flash-lite";

// @desc    Generate a full task description from just a short title
// @route   POST /api/ai/task-description
// @access  Private (any role)
export const generateTaskDescription = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next(new AppError("A task title is required", 400));
  }

  // Prompts are just strings — but being specific about format
  // ("ONLY the description, no preamble, no quotes") matters a lot in
  // practice, otherwise the model tends to add filler like "Sure! Here's
  // a description:" that you'd then have to strip out yourself.
  const prompt = `You are helping write a clear, concise task description for a project management tool.
Task title: "${title}"

Write a 1-3 sentence description explaining what this task likely involves. Do not repeat the title itself in the description. Respond with ONLY the description text — no preamble, no quotation marks, no markdown formatting.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  res.status(200).json({
    success: true,
    data: { description: response.text.trim() },
  });
});

// @desc    Generate a plain-English status summary for a project
// @route   POST /api/ai/projects/:projectId/summary
// @access  Private (any role)
export const generateProjectSummary = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  // Same tenant-scoping check used everywhere else in the app — a
  // project outside your own tenant should behave exactly as if it
  // doesn't exist, even for an AI-powered route.
  const project = await Project.findById(projectId);
  if (!project || project.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("Project not found", 404));
  }

  const tasks = await Task.find({ project: projectId, tenant: req.user.tenant }).populate(
    "assignedTo",
    "name",
  );

  if (tasks.length === 0) {
    return res.status(200).json({
      success: true,
      data: { summary: "This project has no tasks yet, so there's nothing to summarize." },
    });
  }

  // Build a compact, plain-text list of tasks for the prompt. Gemini
  // doesn't need our full Mongoose documents — just the fields that
  // actually matter for writing a status summary.
  const taskLines = tasks
    .map((t) => {
      const assignee = t.assignedTo ? `assigned to ${t.assignedTo.name}` : "unassigned";
      return `- "${t.title}" (status: ${t.status}, priority: ${t.priority}, ${assignee})`;
    })
    .join("\n");

  const prompt = `You are an assistant summarizing a project management board for a busy manager.

Project name: "${project.name}"
Tasks:
${taskLines}

Write a short, plain-English status summary in 3-5 sentences: overall progress, anything that looks stuck or at risk (e.g. many high-priority or unassigned tasks still "todo"), and one concrete, actionable suggestion. Do not use markdown formatting — plain sentences only.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  res.status(200).json({
    success: true,
    data: { summary: response.text.trim() },
  });
});