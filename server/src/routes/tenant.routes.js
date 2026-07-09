import express from "express";
import {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} from "../controllers/tenant.controller.js";

// Routes files ONLY map "URL + HTTP method" → "controller function".
// No logic lives here — that's the controller's job. This keeps routes
// easy to scan: you can see this app's entire Tenant API surface at a glance.
const router = express.Router();

router.route("/").post(createTenant).get(getTenants);

router.route("/:id").get(getTenantById).put(updateTenant).delete(deleteTenant);

export default router;