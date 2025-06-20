const express = require("express");

const router = express.Router();

const postsController = require("../controllers/followers.controller.js");

router.get("/followers", postsController.getAllFollowers);
router.get("/followers/:id", postsController.getOneFollower);
router.post("/followers", postsController.createFollower);
router.delete("/followers/:id", postsController.deleteFollower);

module.exports = router;
