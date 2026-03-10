/**
 *
 * Course Routes
 *
 */

const courseService = require("../services/courseService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

/**
 * Create a new course
 * Only accessible by instructors
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url } = req.body;

    if (!title || !description) {
      return sendError(
        res,
        "Title and description are required",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const newCourse = await courseService.createCourse({
      title,
      description,
      thumbnail_url,
      instructorId: req.user.id,
    });

    return sendResponse(
      res,
      newCourse,
      "Course created successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    if (error.code === "P2002") {
      return sendError(
        res,
        "A course with this title already exists",
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return sendError(
      res,
      "Failed to create course",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get course by ID
 * Publicly accessible (authenticated users only)
 */
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await courseService.getCourseById(id);

    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    return sendResponse(
      res,
      course,
      "Course fetched successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to get course",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get all courses
 * Publicly accessible (or authenticated users only)
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return sendResponse(
      res,
      courses,
      "Courses fetched successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve courses",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await courseService.getCoursesByInstructor(req.user.id);
    return sendResponse(
      res,
      courses,
      "Instructor courses fetched successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve instructor courses",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, thumbnail_url } = req.body;

  try {
    // Check ownership first
    const course = await courseService.getCourseById(id);
    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    if (course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Access denied. You do not own this course.",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const updated = await courseService.updateCourse(id, {
      title,
      description,
      thumbnail_url,
    });

    return sendResponse(res, updated, "Course updated", HTTP_STATUS.OK);
  } catch (error) {
    if (error.code === "P2002") {
      return sendError(
        res,
        "A course with this title already exists",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (error.code === "P2025") {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    return sendError(
      res,
      "Update course failed",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { confirm_delete } = req.body;

  try {
    const courseId = parseInt(id);
    const course = await courseService.getCourseWithEnrollmentCount(courseId);

    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    // check ownership
    if (course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "Access denied. You do not own this course.",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const studentCount = course._count.enrollments;

    // if there are any enrolled student(s), you need to be confirmed to delete the course
    if (studentCount > 0 && confirm_delete !== true) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `This course has ${studentCount} enrolled student(s). Are you sure you want to delete it?`,
        requires_confirmation: true,
      });
    }

    await courseService.deleteCourseWithEnrollments(courseId);
    return sendResponse(
      res,
      null,
      "Course deleted successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Delete course failed",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
