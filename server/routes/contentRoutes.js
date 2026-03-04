/**
 * Content router - Manage route API lessons and topics from courses
 */

const express = require("express");
const router = express.Router();
const contentController = require("../controller/contentController");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

// Course lessons management
router.post(
  "/lessons",
  ensureAuthenticated,
  isInstructor,
  contentController.createLesson,
);
router.get(
  "/courses/:courseId/lessons",
  ensureAuthenticated,
  contentController.getLessonsByCourse,
);

// Lesson topics management
router.post(
  "/topics",
  ensureAuthenticated,
  isInstructor,
  contentController.createTopic,
);

module.exports = router;
