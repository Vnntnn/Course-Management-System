const uploadService = require("../services/uploadService");
const { sendResponse, sendError } = require("../utils/responseHelper");

class UploadController {
    async handleUpload(req, res) {
        try {
            const { courseId } = req.body;
            if (!courseId) {
                return sendError(res, "Course ID is required", 400);
            }

            const updatedCourse = await uploadService.processImage(req.file, courseId);
            return sendResponse(res, updatedCourse, "Uploaded course image successfully", 201);
        } catch (error) {
            if (error.message === "COURSE_NOT_FOUND") {
                return sendError(res, "Course not found", 404);
            }
            if (error.message === "FILE_REQUIRED") {
                return sendError(res, "Please upload an image", 400);
            }
            return sendError(res, "Internal Server Error", 500);
        }
    }
}

module.exports = new UploadController();
