const followersList = [];
const { get } = require("mongoose");
const Follower = require("../models/followers.model");

module.exports = {
  getAllFollowers: async (req, res) => {
    try {
      const followers = await Follower.find();
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowersUser: async (req, res) => {
    try {
      const { followingId } = req.params;
      const followers = await Follower.find({ followingId });
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowingUser: async (req, res) => {
    try {
      const { followerId } = req.params;
      const followers = await Follower.find({ followerId });
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createFollower: async (req, res) => {
    try {
      const { followerId, followingId } = req.params;
      const isFollowing = await Follower.exists({ followerId, followingId });
      if (isFollowing) {
        return res.status(400).json({ error: "Follower already exists" });
      } else {
        const follower = await Follower.create({ followerId, followingId });
        res.status(201).json(follower);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteFollower: async (req, res) => {
    try {
      const { followerId, followingId } = req.params;
      const follower = await Follower.findOneAndDelete({
        followerId,
        followingId,
      });
      res.status(200).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  isFollowing: async (req, res) => {
    const { followerId, followingId } = req.params;

    try {
      const isFollowing = await Follower.exists({ followerId, followingId });
      return res.status(200).json({ isFollowing: !!isFollowing });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
