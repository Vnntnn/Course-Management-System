const express = require("express");
const router = express.Router();
const uploadController = require("../controller/uploadController");
const upload = require("../middleware/upload");
const { ensureAuthenticated, isInstructor } = require("../middleware/auth");

router.post("/", ensureAuthenticated, isInstructor, upload.single("image"), uploadController.handleUpload);

module.exports = router;
