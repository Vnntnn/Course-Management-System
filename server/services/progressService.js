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
    const totalTopics = await prisma.topics.count({
      where: {
        lesson: {
          course_id: parseInt(courseId),
        },
      },
    });

    const completeTopics = await prisma.userProgress.count({
      where: {
        user_id: parseInt(userId),
        topic: {
          lesson: {
            course_id: parseInt(courseId),
          },
        },
      },
    });

    if (totalTopics === 0) {
      return 0;
    }

    return Math.round((completeTopics / totalTopics) * 100);
  }

  async getCompletedTopicIds(userId, courseId) {
    const completed = await prisma.userProgress.findMany({
      where: {
        user_id: parseInt(userId),
        topic: {
          lesson: {
            course_id: parseInt(courseId),
          },
        },
      },
      select: {
        topic_id: true,
      },
    });
    return completed.map((c) => c.topic_id);
  }
}

module.exports = new ProgressService();
