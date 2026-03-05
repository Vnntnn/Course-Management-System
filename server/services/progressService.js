const prisma = require('../config/database');

class ProgressService {
    async markTopicComplete(userId, topicId) {
        return await prisma.UserProgress.upsert({
            where: {
                user_id_topic_id: {
                    user_id: parseInt(userId),
                    topic_id: parseInt(topicId),
                },

            },
            update: {
            },
            create: {
                user_id: parseInt(userId),
                topic_id: parseInt(topicId),
            }
        })
    }

    async getCourseProgress(userId, courseId) {
        const totalTopics = await prisma.topics.count({
            where: {
                lesson: {
                    course_id: parseInt(courseId),
                },
            },
        });

        const completeTopics = await prisma.UserProgress.count({
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

        return Math.round((completedTopics / totalTopics) * 100);
    }
}

module.exports = new ProgressService();