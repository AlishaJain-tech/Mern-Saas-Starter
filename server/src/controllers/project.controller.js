import Project from "../models/Project.js";
import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create a new project in YOUR OWN tenant
// @route   POST /api/projects
// @access  Private (any role)
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  const project = await Project.create({
    name,
    description,
    status,
    createdBy: req.user._id,
    tenant: req.user.tenant, // always the logged-in user's own tenant
  });

  res.status(201).json({ success: true, data: project });
});

// @desc    Get all projects in YOUR OWN tenant
// @route   GET /api/projects
// @access  Private (any role)
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ tenant: req.user.tenant })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: projects.length, data: projects });
});

// @desc    Get a single project by ID — only if it's in your tenant
// @route   GET /api/projects/:id
// @access  Private (any role)
export const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate("createdBy", "name email");

  if (!project || project.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({ success: true, data: project });
});

// @desc    Update a project — only if it's in your tenant
// @route   PUT /api/projects/:id
// @access  Private (any role)
export const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("Project not found", 404));
  }

  // Never allow tenant or createdBy to be changed after creation.
  const { tenant, createdBy, ...safeUpdates } = req.body;

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, safeUpdates, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");

  res.status(200).json({ success: true, data: updatedProject });
});

// @desc    Delete a project — only the creator OR an admin — and
//          cascade-delete every task that belonged to it.
// @route   DELETE /api/projects/:id
// @access  Private (creator or admin)
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("Project not found", 404));
  }

  const isCreator = project.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCreator && !isAdmin) {
    return next(
      new AppError("Only the project creator or an admin can delete this project", 403),
    );
  }

  // CASCADE DELETE: without this, deleting a project would leave its
  // tasks behind in the database, pointing at a project that no longer
  // exists — "orphaned" data that would break any future task lookup.
  // We delete the tasks FIRST, then the project itself.
  await Task.deleteMany({ project: project._id });
  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});