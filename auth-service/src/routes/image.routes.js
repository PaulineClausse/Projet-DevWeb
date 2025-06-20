const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const imageController = require("../controllers/image.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  imageController.uploadImage
);

module.exports = router;
