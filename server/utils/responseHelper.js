/**
 * Sends a successful API response to the client
 * @param {Object} res - Express response object
 * @param {Object|null} data - Optional data to include in the response
 * @param {string} message - A message describing the result of the operation
 * @param {number} statusCode - HTTP status code to send (default: 200)
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
