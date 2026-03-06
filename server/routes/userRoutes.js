const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/upload");
const { ensureAuthenticated, isAdmin, isInstructor } = require("../middleware/auth");
const { sendError, sendResponse } = require("../utils/responseHelper");

// Only admins can view all users
router.route("/").get(ensureAuthenticated, isAdmin, userController.getAllUsers);

router
  .route("/:id")
  .get(ensureAuthenticated, userController.getUserById)
  .put(ensureAuthenticated, userController.updateUser)
  .delete(ensureAuthenticated, isAdmin, userController.deleteUser);

// User upload course/content image (instructors only)
// removed

module.exports = router;
