const userService = require("../services/userService");
const progressService = require("../services/progressService");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { HTTP_STATUS } = require("../utils/constants");

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return sendResponse(
      res,
      users,
      "Users retrieved successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve users",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND);
    }
    return sendResponse(
      res,
      user,
      "User retrieved successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve user",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Update user details
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, role } = req.body;

  try {
    const user = await userService.updateUser(id, { full_name, role });
    return sendResponse(res, user, "User updated successfully", HTTP_STATUS.OK);
  } catch (error) {
    if (error && error.code === "P2025") {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND);
    }
    return sendError(
      res,
      "Failed to update user",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    return sendResponse(res, null, "User deleted successfully", HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, "Failed to delete user", HTTP_STATUS.BAD_REQUEST);
  }
};

exports.updateProgress = async (req, res) => {
  const { topic_id, course_id } = req.body;
  const userId = req.user.id;

  if (topic_id == null) {  
    return sendError(res, "topic_id is required", HTTP_STATUS.BAD_REQUEST);  
  }  

  if (course_id == null) {  
    return sendError(res, "course_id is required", HTTP_STATUS.BAD_REQUEST);  
  }  

  const topicIdNum = Number(topic_id);  
  const courseIdNum = Number(course_id);  

  if (!Number.isInteger(topicIdNum) || topicIdNum <= 0) {  
    return sendError(  
      res,  
      "topic_id must be a positive integer",  
      HTTP_STATUS.BAD_REQUEST,  
    );  
  }  

  if (!Number.isInteger(courseIdNum) || courseIdNum <= 0) {  
    return sendError(  
      res,  
      "course_id must be a positive integer",  
      HTTP_STATUS.BAD_REQUEST,  
    );  
  }

  try {  
    await progressService.markTopicComplete(userId, topicIdNum);  
    const currentProgress = await progressService.getCourseProgress(userId, courseIdNum);  
    return sendResponse(  
      res,  
      null,  
      "Progress updated successfully",  
      HTTP_STATUS.OK,  
      currentProgress,  
    );
  } catch (error) {
    return sendError(res, "Failed to update progress", HTTP_STATUS.BAD_REQUEST);
  }
};