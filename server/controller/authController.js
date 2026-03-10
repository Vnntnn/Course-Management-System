const authService = require("../services/authService");
const passport = require("passport");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS, ROLES } = require("../utils/constants");

exports.register = async (req, res) => {
  const { full_name, password, role } = req.body;
  const email = req.body.email?.trim()?.toLowerCase();

  if (!full_name || !email || !password) {
    return sendError(
      res,
      "Full name, email and password are required",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  if (password.length < 8 || password.length > 20) {
    return sendError(
      res,
      "Password must be between 8 and 20 characters",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const allowedRoles = [ROLES.STUDENT, ROLES.INSTRUCTOR];
  if (role && !allowedRoles.includes(role)) {
    return sendError(
      res,
      "Public registration only allows 'student' or 'instructor' role",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  try {
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, "Email already registered", HTTP_STATUS.CONFLICT);
    }

    const newUser = await authService.register({
      full_name,
      email,
      password,
      role,
    });

    // Auto-login after registration
    req.logIn(newUser, (loginErr) => {
      if (loginErr) {
        console.error("Auto-login after register error:", loginErr);
      }
      return sendResponse(
        res,
        {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
        },
        "User registered successfully",
        HTTP_STATUS.CREATED,
      );
    });
  } catch (err) {
    console.error("Register error:", err);
    return sendError(
      res,
      "Failed to register user",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return sendError(
        res,
        "An error occurred during login",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      return sendError(
        res,
        (info && info.message) || "Invalid credentials",
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Session error:", err);
        return sendError(
          res,
          "Failed to create session",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }

      return sendResponse(
        res,
        {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
        "Login successful",
        HTTP_STATUS.OK,
      );
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return sendError(
        res,
        "Failed to logout",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
    return sendResponse(res, null, "Logout successful", HTTP_STATUS.OK);
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await authService.findUserProfile(req.user.id);
    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND);
    }
    return sendResponse(
      res,
      user,
      "Profile fetched successfully",
      HTTP_STATUS.OK,
    );
  } catch (err) {
    console.error("Get profile error:", err);
    return sendError(
      res,
      "Failed to get user profile",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
