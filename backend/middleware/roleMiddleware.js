/**
 * Middleware to restrict endpoint access to specific user roles.
 * Must be placed after the JWT protect middleware.
 * 
 * @param {...string} allowedRoles - Roles allowed to access the endpoint.
 * @returns {Function} Express middleware function.
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Insufficient access credentials.",
        code: "FORBIDDEN_ACCESS"
      });
    }
    next();
  };
};
