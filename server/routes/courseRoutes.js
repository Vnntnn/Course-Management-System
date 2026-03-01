/**
 *
 * Routes user to course API endpoints
 *
 */

const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

// If user login, allow to access course
router.get("/", ensureAuthenticated, courseController.getAllCourses);

// Course create only for instructor
router.post(
  "/create",
  ensureAuthenticated,
  isInstructor,
  courseController.createCourse,
);

module.exports = router;
