import AppError from "../utils/AppError.js";

// This middleware checks WHAT a logged-in user is allowed to do, as
// opposed to `protect`, which only checks WHO they are. It must always
// run AFTER `protect` in the middleware chain, since it depends on
// `req.user` already being set.
//
// Usage:  router.delete('/:id', protect, authorize('admin'), deleteUser);
// This means: "you must be logged in AND have the 'admin' role."
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

export default authorize;