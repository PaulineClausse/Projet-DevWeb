const express = require("express");

const router = express.Router();

const postsController = require("../controllers/followers.controller.js");

router.get("/followers", postsController.getAllFollowers);
router.get("/followers/followers/:followingId", postsController.getFollowersUser);
router.get("/followers/following/:followerId", postsController.getFollowingUser);
router.post(
  "/followers/create/:followerId/:followingId",
  postsController.createFollower
);
router.delete(
  "/followers/delete/:followerId/:followingId",
  postsController.deleteFollower
);
router.get("/followers/:followerId/:followingId", postsController.isFollowing);

module.exports = router;
