const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { ensureAuthenticated, isAdmin } = require("../middleware/auth");

// Only admins can view all users
router.route("/").get(ensureAuthenticated, isAdmin, userController.getAllUsers);
router.post("/progress", ensureAuthenticated, userController.updateProgress);

router
  .route("/:id")
  .get(ensureAuthenticated, userController.getUserById)
  .put(ensureAuthenticated, userController.updateUser)
  .delete(ensureAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
