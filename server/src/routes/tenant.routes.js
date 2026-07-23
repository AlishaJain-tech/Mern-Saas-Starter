import express from "express";
import { getMyTenant, updateMyTenant } from "../controllers/tenant.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// Every route here requires a logged-in user (`protect`).
// Only admins can update their company's settings (`authorize("admin")`) —
// regular members can view their tenant, but not change it.
router.get("/me", protect, getMyTenant);
router.put("/me", protect, authorize("admin"), updateMyTenant);

export default router;