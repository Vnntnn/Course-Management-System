const express = require("express");
const router = express.Router();
const examController = require("../controller/examController");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

// Exam CRUD
router.post("/", ensureAuthenticated, isInstructor, examController.createExam);
router.put("/:exam_id", ensureAuthenticated, isInstructor, examController.updateExam);
router.delete("/:exam_id", ensureAuthenticated, isInstructor, examController.deleteExam);

// Question management
router.post(
  "/:exam_id/questions",
  ensureAuthenticated,
  isInstructor,
  examController.createQuestions,
);
router.put(
  "/questions/:question_id",
  ensureAuthenticated,
  isInstructor,
  examController.updateQuestion,
);
router.delete(
  "/questions/:question_id",
  ensureAuthenticated,
  isInstructor,
  examController.deleteQuestion,
);

// Get exams by course
router.get("/course/:courseId", ensureAuthenticated, examController.getExamsByCourse);

// Student results
router.get("/my-results", ensureAuthenticated, examController.getMyResults);

// Get exam and submit
router.get("/:exam_id", ensureAuthenticated, examController.getExamForStudent);
router.post("/:exam_id/submit", ensureAuthenticated, examController.submitExam);

module.exports = router;
