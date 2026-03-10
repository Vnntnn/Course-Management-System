const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { ensureAuthenticated } = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.post("/logout", ensureAuthenticated, authController.logout);
router.get("/profile", ensureAuthenticated, authController.getProfile);
router.get("/me", ensureAuthenticated, authController.getProfile);

module.exports = router;
