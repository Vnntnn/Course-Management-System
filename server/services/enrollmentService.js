const prisma = require("../config/database");

class EnrollmentService {
  async enrollStudent(studentId, courseId) {
    return await prisma.enrollments.create({
      data: {
        student_id: parseInt(studentId, 10),
        course_id: parseInt(courseId, 10),
      },
    });
  }

  async getEnrolledCourses(studentId) {
    return await prisma.enrollments.findMany({
      where: {
        student_id: parseInt(studentId, 10),
      },
      include: {
        course: true,
      },
    });
  }

  async isExistingEnrollment(studentId, courseId) {
    const count = await prisma.enrollments.count({
      where: {
        student_id: parseInt(studentId, 10),
        course_id: parseInt(courseId, 10),
      },
    });
    return count > 0;
  }

  async unenrollCourse(studentId, courseId) {
    const parsedStudentId = parseInt(studentId, 10);
    const parsedCourseId = parseInt(courseId, 10);

    const result = await prisma.enrollments.deleteMany({
      where: {
        student_id: parsedStudentId,
        course_id: parsedCourseId,
      },
    });

    return result.count > 0;
  }

  async getStudentsInCourse(courseId) {
    return await prisma.enrollments.findMany({
      where: {
        course_id: parseInt(courseId, 10),
      },
      include: {
        student: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
  }
}

module.exports = new EnrollmentService();
