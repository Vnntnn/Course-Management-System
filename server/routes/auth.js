/**
 *
 * Implement auth route for user login and register
 *
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

// API for user register
router.post("/register", async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        full_name,
        email,
        password_hash: hashedPassword,
        role: role || "student", // default role is student
      }
    });
    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    res.status(400).json({
      message: "Email already been registered or invalid data!",
    });
  }
});

// API for user login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Login successful!",
        user: { id: user.id, role: user.role },
      });
    });
  })(req, res, next);
});

module.exports = router;