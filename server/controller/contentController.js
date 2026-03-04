const contentService = require("../services/contentService");
const courseService = require("../services/courseService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

exports.createLesson = async (req, res) => {
  const { course_id, title } = req.body;

  try {
    const course = await courseService.getCourseById(course_id);

    if (!course) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }

    if (course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "You do not have permission to add lessons to this course",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const lesson = await contentService.createLesson(course_id, title);
    return sendResponse(
      res,
      lesson,
      "Lesson created successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return sendError(
      res,
      "Error creating lesson",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.createTopic = async (req, res) => {
  const { lesson_id, title, content_body, content_type } = req.body;

  try {
    const lesson = await contentService.getLessonByIdWithCourse(lesson_id);

    if (!lesson) {
      return sendError(res, "Lesson not found", HTTP_STATUS.NOT_FOUND);
    }

    if (lesson.course.instructor_id !== req.user.id) {
      return sendError(
        res,
        "You do not have permission to add topics to this lesson",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const topic = await contentService.createTopic(
      lesson_id,
      title,
      content_body,
      content_type,
    );
    return sendResponse(
      res,
      topic,
      "Topic created successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return sendError(
      res,
      "Error creating topic",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const syllabus = await contentService.getFullSyllabus(courseId);
    if (!syllabus) {
      return sendError(res, "Course not found", HTTP_STATUS.NOT_FOUND);
    }
    return sendResponse(
      res,
      syllabus.lessons,
      "Lessons fetched successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Error fetching lessons",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
