import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
 
// This middleware runs BEFORE any protected controller. Its job:
//   1. Read the JWT from the Authorization header
//   2. Verify it's genuine and not expired
//   3. Look up the user it belongs to, and attach it as `req.user`
//
// Once this succeeds, every controller further down the chain can
// simply read `req.user` to know exactly who is making the request —
// without re-checking auth itself.
//
// Usage on a route:  router.get('/me', protect, getMe);
const protect = asyncHandler(async (req, res, next) => {
  let token;
 
  // Tokens are sent as:  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
 
  if (!token) {
    return next(new AppError("Not authorized, no token provided", 401));
  }
 
  let decoded;
  try {
    // Throws if the token is invalid, tampered with, or expired.
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return next(new AppError("Not authorized, invalid or expired token", 401));
  }
 
  // Fetch the actual user this token belongs to. We deliberately look
  // them up fresh from the DB (rather than trusting the token's payload
  // blindly) so that if a user is deleted or their role changes, that
  // takes effect immediately instead of waiting for the token to expire.
  const user = await User.findById(decoded.id);
 
  if (!user) {
    return next(new AppError("Not authorized, user no longer exists", 401));
  }
 
  // Attach the user to the request object — every controller after this
  // point in the chain can now access `req.user`.
  req.user = user;
 
  next();
});
 
export default protect;