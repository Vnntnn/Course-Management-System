/**
 * Authentication middleware
 */

// Ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: "Authentication required",
  });
};

// Check if user has required role(s)
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions",
      });
    }

    next();
  };
};

exports.isStudent = exports.hasRole("student");
exports.isInstructor = exports.hasRole("instructor");
exports.isAdmin = exports.hasRole("admin");
exports.isInstructorOrAdmin = exports.hasRole("instructor", "admin");
