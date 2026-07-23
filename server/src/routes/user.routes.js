import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// Every route requires login. Creating, updating, and deleting
// teammates is admin-only — regular members can only view.
router
  .route("/")
  .post(protect, authorize("admin"), createUser)
  .get(protect, getUsers);

router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

export default router;