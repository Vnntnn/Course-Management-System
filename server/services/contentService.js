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

  async updateLesson(lessonId, data) {
    const updateData = {};
    if (data.title) updateData.title = data.title;
    
    return await prisma.lessons.update({
      where: { id: parseInt(lessonId, 10) },
      data: updateData,
    });
  }

  async deleteLesson(lessonId) {
    const parsedId = parseInt(lessonId, 10);
    // Delete all topics belonging to this lesson first
    await prisma.topics.deleteMany({
      where: { lesson_id: parsedId },
    });
    // Then delete the lesson
    return await prisma.lessons.delete({
      where: { id: parsedId },
    });
  }

  async getTopicById(topicId) {
    return await prisma.topics.findUnique({
      where: { id: parseInt(topicId, 10) },
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

  async updateTopic(topicId, data) {
    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.content_body) updateData.content_body = data.content_body;
    if (data.content_type) updateData.content_type = data.content_type;
    
    return await prisma.topics.update({
      where: { id: parseInt(topicId, 10) },
      data: updateData,
    });
  }

  async deleteTopic(topicId) {
    return await prisma.topics.delete({
      where: { id: parseInt(topicId, 10) },
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
