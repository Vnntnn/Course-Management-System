const prisma = require("../config/database");
const { DEFAULT_THUMBNAIL } = require("../utils/constants");

class CourseService {
  async createCourse(courseData) {
    const { title, description, thumbnail_url, instructorId, instructor_id } =
      courseData;
    return await prisma.courses.create({
      data: {
        title,
        description,
        thumbnail_url: thumbnail_url || DEFAULT_THUMBNAIL,
        instructor_id: instructorId || instructor_id,
      },
    });
  }

  async getCourseById(id) {
    return await prisma.courses.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        instructor: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllCourses() {
    return await prisma.courses.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
  }

  async getCourseWithEnrollmentCount(id) {
    return await prisma.courses.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }

  async updateCourse(id, updateData) {
    const { title, description, thumbnail_url } = updateData;
    return await prisma.courses.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        title,
        description,
        thumbnail_url,
      },
    });
  }

  async deleteCourseWithEnrollments(id) {
    const courseId = parseInt(id, 10);
    return await prisma.$transaction(async (tx) => {
      const lessons = await tx.lessons.findMany({
        where: { course_id: courseId },
      });
      if (lessons.length > 0) {
        const lessonIds = lessons.map((l) => l.id);
        await tx.topics.deleteMany({ where: { lesson_id: { in: lessonIds } } });
      }
      await tx.lessons.deleteMany({ where: { course_id: courseId } });
      await tx.enrollments.deleteMany({ where: { course_id: courseId } });
      await tx.courses.delete({ where: { id: courseId } });
    });
  }
}

module.exports = new CourseService();
