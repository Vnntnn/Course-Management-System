const prisma = require("../config/database");

class ContentService {
  async getLessonByIdWithCourse(lessonId) {
    return await prisma.lessons.findUnique({
      where: { id: parseInt(lessonId, 10) },
      include: { course: true },
    });
  }

  async createLesson(courseId, title) {
    const parsedCourseId = parseInt(courseId, 10);
    const count = await prisma.lessons.count({
      where: { course_id: parsedCourseId },
    });
    return await prisma.lessons.create({
      data: {
        course_id: parsedCourseId,
        title,
        order_index: count + 1,
      },
    });
  }

  async createTopic(lessonId, title, contentBody, contentType) {
    const parsedLessonId = parseInt(lessonId, 10);
    const count = await prisma.topics.count({
      where: { lesson_id: parsedLessonId },
    });
    return await prisma.topics.create({
      data: {
        lesson_id: parsedLessonId,
        title,
        content_type: contentType || "text",
        content_body: contentBody,
        order_index: count + 1,
      },
    });
  }

  async getFullSyllabus(courseId) {
    return await prisma.courses.findUnique({
      where: { id: parseInt(courseId, 10) },
      include: {
        lessons: {
          orderBy: { order_index: "asc" },
          include: {
            topics: { orderBy: { order_index: "asc" } },
          },
        },
      },
    });
  }
}

module.exports = new ContentService();
