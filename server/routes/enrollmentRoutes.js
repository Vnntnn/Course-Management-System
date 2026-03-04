const express = require("express");
const router = express.Router();
const enrollmentController = require("../controller/enrollmentController");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

// Student enroll and see their courses
router.post("/enroll", ensureAuthenticated, enrollmentController.enrollCourse);
router.get(
  "/my-courses",
  ensureAuthenticated,
  enrollmentController.getEnrolledCourses,
);
router.delete(
  "/unenroll/:course_id",
  ensureAuthenticated,
  enrollmentController.unenrollCourse,
);
// For instructors to view students enrolled in their courses
router.get(
  "/courses/:courseId/students",
  ensureAuthenticated,
  isInstructor,
  enrollmentController.getStudentsInCourse,
);

module.exports = router;
