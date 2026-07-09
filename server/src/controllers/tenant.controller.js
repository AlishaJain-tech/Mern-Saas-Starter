import Tenant from "../models/Tenant.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create a new tenant
// @route   POST /api/tenants
export const createTenant = asyncHandler(async (req, res) => {
  const { name, slug, plan } = req.body;

  const tenant = await Tenant.create({ name, slug, plan });

  res.status(201).json({ success: true, data: tenant });
});

// @desc    Get all tenants
// @route   GET /api/tenants
export const getTenants = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find();

  res.status(200).json({ success: true, count: tenants.length, data: tenants });
});

// @desc    Get a single tenant by ID
// @route   GET /api/tenants/:id
export const getTenantById = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return next(new AppError("Tenant not found", 404));
  }

  res.status(200).json({ success: true, data: tenant });
});

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
export const updateTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document, not the original
    runValidators: true, // re-run schema validation on update
  });

  if (!tenant) {
    return next(new AppError("Tenant not found", 404));
  }

  res.status(200).json({ success: true, data: tenant });
});

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
export const deleteTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findByIdAndDelete(req.params.id);

  if (!tenant) {
    return next(new AppError("Tenant not found", 404));
  }

  res.status(200).json({ success: true, data: {} });
});