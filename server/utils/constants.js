/**
 * Helper constants to avoid role typos and keep the codebase consistent.
 */

module.exports = {
  ROLES: {
    STUDENT: "student",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
  },
  DEFAULT_THUMBNAIL: "https://dummyimage.com/600x400/ebebeb/000000&text=Course",
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
};
