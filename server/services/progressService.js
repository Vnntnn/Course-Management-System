const prisma = require('../config/database');

class ProgressService {
    async markTopicComplete(userId, topicId) {
        return await prisma.userProgress.upsert({
            where: {
                user_id_topic_id: {
                    user_id: parseInt(userId, 10),
                    topic_id: parseInt(topicId, 10),
                },

            },
            update: {},
            create: {
                user_id: parseInt(userId, 10),
                topic_id: parseInt(topicId, 10),
            }
        })
    }

    async getCourseProgress(userId, courseId) {
        const totalTopics = await prisma.topics.count({
            where: {
                lesson: {
                    course_id: parseInt(courseId, 10),
                },
            },
        });

        const completedTopics = await prisma.userProgress.count({
            where: {
                user_id: parseInt(userId, 10),
                topic: {
                    lesson: {
                        course_id: parseInt(courseId, 10),
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
