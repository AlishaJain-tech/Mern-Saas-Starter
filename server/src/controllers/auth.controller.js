import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
 
// @desc    Register a new user — either creating a brand new tenant,
//          or joining an existing one by slug.
// @route   POST /api/auth/register
//
// Expected body:
//   { name, email, password, mode: "create", tenantName, tenantSlug }
//   OR
//   { name, email, password, mode: "join", tenantSlug }
//
// IMPORTANT: the user's `role` is decided HERE on the server (admin if
// creating, member if joining) — never taken directly from req.body.
// If we trusted the client to send `role`, anyone could register as
// "admin" by just editing their request. Never trust the client with
// anything security-sensitive.
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, mode, tenantName, tenantSlug } = req.body;
 
  if (!name || !email || !password || !mode || !tenantSlug) {
    return next(new AppError("Missing required fields", 400));
  }
 
  // Reject early if this email is already registered anywhere.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email is already registered", 400));
  }
 
  let tenant;
  let role;
 
  if (mode === "create") {
    if (!tenantName) {
      return next(new AppError("tenantName is required when creating a tenant", 400));
    }
 
    const existingTenant = await Tenant.findOne({ slug: tenantSlug });
    if (existingTenant) {
      return next(new AppError("That tenant slug is already taken", 400));
    }
 
    tenant = await Tenant.create({ name: tenantName, slug: tenantSlug });
    role = "admin"; // the person creating a tenant becomes its admin
  } else if (mode === "join") {
    tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return next(new AppError("No tenant found with that slug", 404));
    }
 
    role = "member"; // joining an existing tenant makes you a member
  } else {
    return next(new AppError('mode must be either "create" or "join"', 400));
  }
 
  // Note: we pass the PLAIN password here — the User model's
  // pre("save") hook hashes it automatically before it's stored.
  const user = await User.create({
    name,
    email,
    password,
    role,
    tenant: tenant._id,
  });
 
  const token = generateToken(user._id, tenant._id);
 
  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
      },
    },
  });
});
 
// @desc    Log in an existing user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }
 
  // password has `select: false` on the schema, so we must explicitly
  // request it here with .select("+password") — otherwise user.password
  // would be undefined and comparePassword() would fail.
  const user = await User.findOne({ email }).select("+password").populate("tenant");
 
  // Deliberately vague error message — we don't want to reveal WHETHER
  // the email exists or the password was wrong. Saying "Invalid email"
  // vs "Invalid password" separately would let attackers discover which
  // emails are registered.
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
 
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }
 
  const token = generateToken(user._id, user.tenant._id);
 
  res.status(200).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: user.tenant._id,
        name: user.tenant.name,
        slug: user.tenant.slug,
      },
    },
  });
});