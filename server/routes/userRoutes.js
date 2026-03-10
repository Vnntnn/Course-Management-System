const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { ensureAuthenticated, isAdmin } = require("../middleware/auth");

router.route("/").get(ensureAuthenticated, isAdmin, userController.getAllUsers);

// Must be before /:id
router.post("/progress", ensureAuthenticated, userController.updateProgress);
router.get("/progress/:courseId", ensureAuthenticated, userController.getCompletedTopics);

router
  .route("/:id")
  .get(ensureAuthenticated, userController.getUserById)
  .put(ensureAuthenticated, userController.updateUser)
  .delete(ensureAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
