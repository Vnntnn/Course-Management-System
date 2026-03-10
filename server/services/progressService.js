const prisma = require("../config/database");

class ProgressService {
  async markTopicComplete(userId, topicId) {
    return await prisma.userProgress.upsert({
      where: {
        user_id_topic_id: {
          user_id: parseInt(userId),
          topic_id: parseInt(topicId),
        },
      },
      update: {
        completed_at: new Date(),
      },
      create: {
        user_id: parseInt(userId),
        topic_id: parseInt(topicId),
      },
    });
  }

  async getCourseProgress(userId, courseId) {
    const parsedUserId = parseInt(userId);
    const parsedCourseId = parseInt(courseId);

    // Count topics
    const totalTopics = await prisma.topics.count({
      where: {
        lesson: { course_id: parsedCourseId },
      },
    });

    const completedTopics = await prisma.userProgress.count({
      where: {
        user_id: parsedUserId,
        topic: {
          lesson: { course_id: parsedCourseId },
        },
      },
    });

    // Count exams
    const totalExams = await prisma.exams.count({
      where: { course_id: parsedCourseId },
    });

    // Count distinct exams the student has PASSED (score >= 50% of total questions)
    const passedExamResults = await prisma.exam_results.findMany({
      where: {
        student_id: parsedUserId,
        exam: { course_id: parsedCourseId },
      },
      include: {
        exam: { select: { total_questions: true } },
      },
    });

    // Group by exam_id: track best score and that exam's total_questions
    const examBest = {}; // { exam_id: { score, total } }
    for (const r of passedExamResults) {
      const total = r.exam.total_questions || 1;
      if (!examBest[r.exam_id] || r.score > examBest[r.exam_id].score) {
        examBest[r.exam_id] = { score: r.score, total };
      }
    }
    // Only count exams where best score >= 50% of that exam's total
    const completedExamCount = Object.values(examBest).filter(e => e.score >= e.total * 0.5).length;

    const totalItems = totalTopics + totalExams;
    const completedItems = completedTopics + completedExamCount;

    if (totalItems === 0) {
      return 0;
    }

    return Math.round((completedItems / totalItems) * 100);
  }
}

module.exports = new ProgressService();
