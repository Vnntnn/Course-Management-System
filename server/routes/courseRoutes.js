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

// CRUD operations for courses (instructors only)
router.post(
  "/create",
  ensureAuthenticated,
  isInstructor,
  courseController.createCourse,
);
router.get("/:id", ensureAuthenticated, courseController.getCourseById);
router.put(
  "/:id",
  ensureAuthenticated,
  isInstructor,
  courseController.updateCourse,
);
router.delete(
  "/:id",
  ensureAuthenticated,
  isInstructor,
  courseController.deleteCourse,
);

module.exports = router;
