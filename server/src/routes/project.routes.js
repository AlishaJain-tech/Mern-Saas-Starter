import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import taskRoutes from "./task.routes.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createProject).get(protect, getProjects);

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Nest the Task router inside the Project router. Any request to
// /api/projects/:projectId/tasks... gets handled by taskRoutes, with
// :projectId available inside it thanks to mergeParams (see task.routes.js).
router.use("/:projectId/tasks", taskRoutes);

export default router;