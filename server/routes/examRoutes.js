const express = require("express");
const router = express.Router();
const examController = require("../controller/examController");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

router.post("/", ensureAuthenticated, isInstructor, examController.createExam);
router.post(
  "/:exam_id/questions",
  ensureAuthenticated,
  isInstructor,
  examController.createQuestions,
);

router.get("/my-results", ensureAuthenticated, examController.getMyResults);

router.get("/:exam_id", ensureAuthenticated, examController.getExamForStudent);
router.post("/:exam_id/submit", ensureAuthenticated, examController.submitExam);

module.exports = router;
