const express = require("express");
const router = express.Router();
const enrollmentController = require("../controller/enrollmentController");
const {
  ensureAuthenticated,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

// Student enroll and see their courses
router.post(
  "/enroll",
  ensureAuthenticated,
  isStudent,
  enrollmentController.enrollCourse,
);
router.get(
  "/my-courses",
  ensureAuthenticated,
  isStudent,
  enrollmentController.getEnrolledCourses,
);
router.get(
  "/check/:course_id",
  ensureAuthenticated,
  enrollmentController.checkEnrollment,
);
router.delete(
  "/unenroll/:course_id",
  ensureAuthenticated,
  isStudent,
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
