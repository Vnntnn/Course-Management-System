const examService = require("../services/examService");
const courseService = require("../services/courseService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

exports.createExam = async (req, res) => {
  const { course_id, title, total_questions } = req.body;
  try {
    if (!course_id || !title) {
    if (!course_id || !title) {
      return sendError(
        res,
        "course_id and title are required.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const course = await courseService.getCourseById(course_id);
    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    // Verify that the instructor owns the course
    if (course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to create exam for this course",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const exam = await examService.createExam(
      course_id,
      title,
      total_questions,
    );
    return sendResponse(
      res,
      exam,
      "Exam created successfully.",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.createQuestions = async (req, res) => {
  const { exam_id } = req.params;
  const { questions } = req.body; // questions should be [{ question_text, option_a, option_b, option_c, option_d, correct_option }]

  try {
    const exam = await examService.getExamById(exam_id);
    if (!exam) {
      return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    }

    // Ensure the current user is the instructor of the course
    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to add questions to this exam",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    if (!Array.isArray(questions)) {
      return sendError(
        res,
        "Questions must be an array",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const result = await examService.createQuestions(exam_id, questions);
    return sendResponse(
      res,
      result,
      "Add question completed.",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getExamForStudent = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await examService.getExamById(exam_id);

    if (!exam) return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    return sendResponse(res, exam, "Get exam successfully.", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.submitExam = async (req, res) => {
  const { exam_id } = req.params;
  const { answers } = req.body;
  const studentId = req.user.id;

  try {
    const exam = await examService.getExamById(exam_id);
    if (!exam) {
      return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    }

    if (!Array.isArray(answers)) {
      return sendError(
        res,
        "Answers must be an array",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const resultData = await examService.submitExam(
      studentId,
      exam_id,
      answers,
    );

    return sendResponse(
      res,
      resultData,
      "Exam submitted successfully.",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await examService.getStudentResults(req.user.id);
    return sendResponse(
      res,
      results,
      "Get test results completed.",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
