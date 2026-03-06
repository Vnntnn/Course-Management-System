const prisma = require("../config/database");

class UploadService {
    async processImage(file, courseId) {
        if (!file) {
            throw new Error("FILE_REQUIRED");
        }

        if (!courseId) {
            throw new Error("COURSE_ID_REQUIRED");
        }

        const imageUrl = `/uploads/${file.filename}`;
        
        try {
            const updateCourse = await prisma.courses.update({
                where: { id: parseInt(courseId, 10) },
                data: { thumbnail_url: imageUrl }
            });
            return updateCourse;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error("COURSE_NOT_FOUND");
            }
            throw error;
        }
    }
}

module.exports = new UploadService();