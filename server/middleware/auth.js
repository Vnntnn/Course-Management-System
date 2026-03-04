const { ROLES } = require("../utils/constants");

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

exports.isStudent = exports.hasRole(ROLES.STUDENT);
exports.isInstructor = exports.hasRole(ROLES.INSTRUCTOR);
exports.isAdmin = exports.hasRole(ROLES.ADMIN);
exports.isInstructorOrAdmin = exports.hasRole(ROLES.INSTRUCTOR, ROLES.ADMIN);
