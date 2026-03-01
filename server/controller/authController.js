const bcrypt = require("bcrypt");
const prisma = require("../config/database");

/**
 * Register new user
 */
exports.register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  // Validation
  if (!full_name || !email || !password) {
    return res.status(400).json({
      message: "Full name, email and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  if (role && role !== "student") {
    return res.status(400).json({
      message: "Public registration only allows 'student' role",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        full_name,
        email,
        password_hash: hashedPassword,
        role: role || "student",
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      message: "Failed to register user",
    });
  }
};

/**
 * Login user
 */
exports.login = (req, res, next) => {
  const passport = require("passport");

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "An error occurred during login",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info.message || "Invalid credentials",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Session error:", err);
        return res.status(500).json({
          message: "Failed to create session",
        });
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
};

/**
 * Logout user
 */
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to logout",
      });
    }

    res.json({
      message: "Logout successful",
    });
  });
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      message: "Failed to get user profile",
    });
  }
};
