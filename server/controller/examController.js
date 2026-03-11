const examService = require("../services/examService");
const courseService = require("../services/courseService");
const enrollmentService = require("../services/enrollmentService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

exports.createExam = async (req, res) => {
  const { course_id, title, total_questions } = req.body;
  try {
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

exports.updateExam = async (req, res) => {
  const { exam_id } = req.params;
  const { title, total_questions } = req.body;

  try {
    const exam = await examService.getExamById(exam_id);
    if (!exam) {
      return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    }

    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to update this exam",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const updated = await examService.updateExam(exam_id, { title, total_questions });
    return sendResponse(res, updated, "Exam updated successfully.", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteExam = async (req, res) => {
  const { exam_id } = req.params;

  try {
    const exam = await examService.getExamById(exam_id);
    if (!exam) {
      return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    }

    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to delete this exam",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    await examService.deleteExam(exam_id);
    return sendResponse(res, null, "Exam deleted successfully.", HTTP_STATUS.OK);
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

exports.updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

  try {
    const question = await examService.getQuestionById(question_id);
    if (!question) {
      return sendError(res, "Question not found", HTTP_STATUS.NOT_FOUND);
    }

    const exam = await examService.getExamById(question.exam_id);
    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to update this question",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const updated = await examService.updateQuestion(question_id, {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
    });
    return sendResponse(res, updated, "Question updated successfully.", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const question = await examService.getQuestionById(question_id);
    if (!question) {
      return sendError(res, "Question not found", HTTP_STATUS.NOT_FOUND);
    }

    const exam = await examService.getExamById(question.exam_id);
    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Unauthorized to delete this question",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    await examService.deleteQuestion(question_id);
    return sendResponse(res, null, "Question deleted successfully.", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getExamsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const exams = await examService.getExamsByCourse(courseId);
    return sendResponse(res, exams, "Exams fetched successfully.", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getExamForInstructor = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await examService.getExamById(exam_id);
    
    if (!exam) return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);
    
    const course = await courseService.getCourseById(exam.course_id);
    if (!course || course.instructor_id !== req.user.id) {
      return sendError(res, "Unauthorized", HTTP_STATUS.FORBIDDEN);
    }
    
    return sendResponse(res, exam, "Exam fetched successfully", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

exports.getExamForStudent = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await examService.getExamForStudent(exam_id);

    if (!exam) return sendError(res, "Exam not found", HTTP_STATUS.NOT_FOUND);

    // Check enrollment (skip for instructors who own the course)
    const course = await courseService.getCourseById(exam.course_id);
    if (course && course.instructor_id !== req.user.id) {
      const enrolled = await enrollmentService.isExistingEnrollment(req.user.id, exam.course_id);
      if (!enrolled) {
        return sendError(res, "You must enroll in this course first", HTTP_STATUS.FORBIDDEN);
      }
    }

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

    // Check enrollment before allowing submit
    const enrolled = await enrollmentService.isExistingEnrollment(studentId, exam.course_id);
    if (!enrolled) {
      return sendError(res, "You must enroll in this course first", HTTP_STATUS.FORBIDDEN);
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
