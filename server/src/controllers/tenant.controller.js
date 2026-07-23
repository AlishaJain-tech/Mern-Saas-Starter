import Tenant from "../models/Tenant.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// NOTE: There is deliberately NO general-purpose "createTenant" endpoint
// here anymore. Tenant creation already happens correctly through
// POST /api/auth/register (mode: "create") — that flow creates the
// Tenant AND its first admin user together, atomically. A separate,
// unrestricted createTenant endpoint would let anyone create tenants
// without going through registration at all, which defeats the point.

// @desc    Get the CURRENT user's own tenant
// @route   GET /api/tenants/me
// @access  Private (any logged-in user, any role)
//
// There is no more "get tenant by arbitrary :id" — a regular user has
// no legitimate reason to look up a DIFFERENT company's tenant record.
// req.user.tenant (set by the `protect` middleware) is the ONLY tenant
// this request is ever allowed to touch.
export const getMyTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) {
    return next(new AppError("Tenant not found", 404));
  }

  res.status(200).json({ success: true, data: tenant });
});

// @desc    Update the CURRENT user's own tenant (e.g. company name)
// @route   PUT /api/tenants/me
// @access  Private, admin only (see authorize("admin") in the route)
export const updateMyTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findByIdAndUpdate(req.user.tenant, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tenant) {
    return next(new AppError("Tenant not found", 404));
  }

  res.status(200).json({ success: true, data: tenant });
});