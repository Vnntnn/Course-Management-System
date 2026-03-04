// const { use } = require("passport");
// const prisma = require("../config/database");

// class ProgressService {
//     async markTopicCompleted(userId, topicId) {
//         return await prisma.student_progress.upsert({
//             where: {
//                 user_id_topic_id: {
//                 user_id: userId,
//                 topic_id: parseInt(topicId, 10)
//                 },
//             },
//             update: {},
//             create: {
//                 user_id: userId,
//                 topic_id: parseInt(topicId),
//             },
//         })
//     }

//     async getCourseProgress(userId, courseId) {
//         const totalTopics = await prisma.topics.count({
//             where: {
//                 lesson: {
//                     course_id: parseInt(courseId),
//                 },
//             },
//         });

//         const completedTopics = await prisma.student_progress.count({
//             where: {
//                 user_id: userId,
//                 topic: {
//                     lesson: {
//                         course_id: parseInt(courseId),
//                     },
//                 },
//             },
//         });

//         return {
//             totalTopics,
//             completedTopics,
//             progress: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
//         };
//     }
