const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");
const verifyToken = require("../middlewares/VerifyToken");

router.get("/", verifyToken, controller.getNotifications);
router.post("/", controller.createNotification);
router.patch("/:id/read", verifyToken, controller.markAsRead);

module.exports = router;