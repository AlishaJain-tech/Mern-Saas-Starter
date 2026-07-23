import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import protect from "../middlewares/auth.middleware.js";

// { mergeParams: true } is the crucial part here. This router will be
// mounted INSIDE project.routes.js at a path like "/:projectId/tasks".
// Without mergeParams, this router would only see whatever comes AFTER
// "/tasks" in the URL — it wouldn't know about ":projectId" at all,
// and req.params.projectId would be undefined in every controller
// function above. mergeParams: true tells this router "also give me
// the params matched by whatever router mounted you."
const router = express.Router({ mergeParams: true });

router.route("/").post(protect, createTask).get(protect, getTasks);

router
  .route("/:taskId")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;

