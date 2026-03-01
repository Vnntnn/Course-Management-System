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

// Only instructors can create courses
router.post(
  "/create",
  ensureAuthenticated,
  isInstructor,
  courseController.createCourse,
);

module.exports = router;
