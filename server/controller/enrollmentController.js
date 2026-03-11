const enrollmentService = require("../services/enrollmentService");
const courseService = require("../services/courseService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

exports.enrollCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const studentId = req.user.id;

    if (!course_id) {
      return sendError(res, "Course ID is required", HTTP_STATUS.BAD_REQUEST);
    }

    const course = await courseService.getCourseById(course_id);
    if (!course) {
      return sendError(res, "Course does not exist", HTTP_STATUS.NOT_FOUND);
    }

    const isEnrolled = await enrollmentService.isExistingEnrollment(
      studentId,
      course_id,
    );
    if (isEnrolled) {
      return sendError(
        res,
        "Already enrolled in this course",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const enrollment = await enrollmentService.enrollStudent(
      studentId,
      course_id,
    );
    return sendResponse(
      res,
      enrollment,
      "Enrolled in course successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return sendError(
      res,
      "Error enrolling in course",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await enrollmentService.getEnrolledCourses(studentId);
    return sendResponse(
      res,
      courses,
      "Fetched enrolled courses successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to get enrolled courses",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.unenrollCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const studentId = req.user.id;

    const deleted = await enrollmentService.unenrollCourse(
      studentId,
      course_id,
    );
    if (!deleted) {
      return sendError(
        res,
        "Not enrolled in this course",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return sendResponse(
      res,
      null,
      "Unenrolled from course successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to unenroll from course",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.getStudentsInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Ensure the instructor owns the course
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    if (course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "You do not have permission to view this course's students",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const enrollments = await enrollmentService.getStudentsInCourse(courseId);
    return sendResponse(
      res,
      enrollments,
      "Fetched students successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to fetch students for course",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrolled = await enrollmentService.isExistingEnrollment(
      studentId,
      courseId,
    );
    return sendResponse(
      res,
      { enrolled },
      "Enrollment status checked",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to check enrollment",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
