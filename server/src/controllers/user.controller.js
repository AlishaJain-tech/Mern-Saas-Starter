import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create a new user
// @route   POST /api/users
// NOTE: This stores the password as plain text for now, purely to test
// that the model and CRUD wiring work end-to-end. This is INSECURE and
// temporary — Day 5 replaces this with proper bcrypt password hashing
// before any real registration/login exists.
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, tenant } = req.body;

  const user = await User.create({ name, email, password, role, tenant });

  res.status(201).json({ success: true, data: user });
});

// @desc    Get all users
// @route   GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  // .populate("tenant") replaces the raw tenant ObjectId with the full
  // Tenant document, so the response shows tenant name/slug/plan too.
  const users = await User.find().populate("tenant");

  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get a single user by ID
// @route   GET /api/users/:id
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("tenant");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update a user
// @route   PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ success: true, data: {} });
});