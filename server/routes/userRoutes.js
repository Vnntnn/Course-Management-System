const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/upload");
const { ensureAuthenticated, isAdmin, isInstructor } = require("../middleware/auth");
const { sendError, sendResponse } = require("../utils/responseHelper");

// Only admins can view all users
router.route("/").get(ensureAuthenticated, isAdmin, userController.getAllUsers);

router
  .route("/:id")
  .get(ensureAuthenticated, userController.getUserById)
  .put(ensureAuthenticated, userController.updateUser)
  .delete(ensureAuthenticated, isAdmin, userController.deleteUser);

// User upload course/content image (instructors only)
router.post('/upload', ensureAuthenticated, isInstructor, upload.single('image'), (req, res) => {
  if (!req.file) { return sendError(res, "Please upload an image", 400, false) };
  const imageUrl = `/uploads/${req.file.filename}`;
  return sendResponse(res, 201, true, "Image uploaded successfully", { url: imageUrl });
})

module.exports = router;
