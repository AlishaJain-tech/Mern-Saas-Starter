import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Small shared helper: confirms the :projectId in the URL actually
// exists AND belongs to the logged-in user's own tenant. Every task
// route needs this check first, before doing anything else — a task
// can never be created/read/updated under a project you don't have
// access to, even if the project ID is technically valid.
const findAccessibleProject = async (projectId, tenantId) => {
  const project = await Project.findById(projectId);

  if (!project || project.tenant.toString() !== tenantId.toString()) {
    return null;
  }

  return project;
};

// @desc    Create a task under a specific project
// @route   POST /api/projects/:projectId/tasks
// @access  Private (any role)
export const createTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await findAccessibleProject(projectId, req.user.tenant);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee || assignee.tenant.toString() !== req.user.tenant.toString()) {
      return next(new AppError("assignedTo must be a user in your own tenant", 400));
    }
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    project: project._id,
    tenant: req.user.tenant,
  });

  res.status(201).json({ success: true, data: task });
});

// @desc    Get all tasks under a specific project
// @route   GET /api/projects/:projectId/tasks?status=todo&priority=high
// @access  Private (any role)
export const getTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { status, priority } = req.query;

  const project = await findAccessibleProject(projectId, req.user.tenant);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  // Filtering by BOTH project and tenant here is deliberate belt-and-
  // suspenders: findAccessibleProject already confirmed the project is
  // in this tenant, but filtering the Task query by tenant too means
  // there's no path where a task could ever leak across a boundary,
  // even if this function were called differently in the future.
  const filter = { project: projectId, tenant: req.user.tenant };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get a single task by ID within a specific project
// @route   GET /api/projects/:projectId/tasks/:taskId
// @access  Private (any role)
export const getTaskById = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;

  const project = await findAccessibleProject(projectId, req.user.tenant);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const task = await Task.findOne({ _id: taskId, project: projectId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Update a task within a specific project
// @route   PUT /api/projects/:projectId/tasks/:taskId
// @access  Private (any role)
export const updateTask = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;

  const project = await findAccessibleProject(projectId, req.user.tenant);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (req.body.assignedTo) {
    const assignee = await User.findById(req.body.assignedTo);
    if (!assignee || assignee.tenant.toString() !== req.user.tenant.toString()) {
      return next(new AppError("assignedTo must be a user in your own tenant", 400));
    }
  }

  // Never allow these to be changed via update — a task can't be moved
  // to a different project/tenant after the fact through this route.
  const { tenant, project: projectField, createdBy, ...safeUpdates } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(taskId, safeUpdates, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({ success: true, data: updatedTask });
});

// @desc    Delete a task — only the creator OR an admin
// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @access  Private (creator or admin)
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { projectId, taskId } = req.params;

  const project = await findAccessibleProject(projectId, req.user.tenant);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCreator && !isAdmin) {
    return next(new AppError("Only the task creator or an admin can delete this task", 403));
  }

  await Task.findByIdAndDelete(taskId);

  res.status(200).json({ success: true, data: {} });
});