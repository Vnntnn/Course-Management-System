/**
 * 
 * Middleware to ensure that the user is login before accessing to resources
 * 
 */

// Check authentication
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(401).json({
        message: "Please, Login first!"
    });
};

// Check instructor role
exports.isInstructor = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "instructor") {
        return next();
    }

    res.status(403).json({
        message: "Access denied. Instructors only."
    });
}

// Check student role
exports.isStudent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "student") {
        return next();
    }

    res.status(403).json({
        message: "Access denied. Students only."
    });
}