import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create (invite) a new teammate into YOUR OWN tenant
// @route   POST /api/users
// @access  Private, admin only
//
// This is now effectively an "invite a teammate" action, not a general
// signup — real signup happens through /api/auth/register. Notice we
// completely IGNORE any `tenant` or `role` the client might send in the
// body — an admin inviting someone can only ever add them to their OWN
// tenant, as a "member". This prevents an admin from accidentally (or
// maliciously) assigning someone to a different company, or creating
// another admin through this side door.
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: "member", // fixed — this route can never create admins
    tenant: req.user.tenant, // fixed — always the inviter's own tenant
  });

  res.status(201).json({ success: true, data: user });
});

// @desc    Get all users WITHIN YOUR OWN tenant
// @route   GET /api/users
// @access  Private (any role)
//
// This is the core of tenant-scoping: instead of User.find() (which
// would return EVERY user across EVERY company), we filter by
// { tenant: req.user.tenant } — the tenant the logged-in user
// belongs to, taken from their own verified token, never from the URL
// or request body.
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ tenant: req.user.tenant }).populate("tenant");

  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get a single user by ID — but ONLY if they're in your tenant
// @route   GET /api/users/:id
// @access  Private (any role)
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("tenant");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Even though the user EXISTS in the database, if they belong to a
  // DIFFERENT tenant, we treat it as "not found" rather than "forbidden".
  // This avoids leaking the mere existence of users in other companies.
  if (user.tenant._id.toString() !== req.user.tenant.toString()) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update a user — admin only, same-tenant only
// @route   PUT /api/users/:id
// @access  Private, admin only
export const updateUser = asyncHandler(async (req, res, next) => {
  const targetUser = await User.findById(req.params.id);

  if (!targetUser || targetUser.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("User not found", 404));
  }

  // Prevent role escalation through this endpoint — role changes are
  // sensitive enough to deserve their own dedicated feature later,
  // rather than being smuggled in through a generic update.
  const { role, tenant, ...safeUpdates } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, safeUpdates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete a user — admin only, same-tenant only
// @route   DELETE /api/users/:id
// @access  Private, admin only
export const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new AppError("You cannot delete your own account via this route", 400));
  }

  const targetUser = await User.findById(req.params.id);

  if (!targetUser || targetUser.tenant.toString() !== req.user.tenant.toString()) {
    return next(new AppError("User not found", 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});