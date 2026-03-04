/**
 *
 * Helper functions that send API back to frontend
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code to send
 * @param {boolean} success - If the operation was successful
 * @param {string} message - A message describing the result of the operation
 * @param {Object|null} data - Optional additional data to include in the response
 *
 */

const sendResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (res, message = "Error", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { sendResponse, sendError };
