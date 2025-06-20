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

  getOneFollower: async (req, res) => {
    try {
      const { id } = req.params;
      const follower = await Follower.findById(id);
      res.status(200).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createFollower: async (req, res) => {
    try {
      const follower = await Follower.create(req.body);
      res.status(201).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteFollower: async (req, res) => {
    try {
      const { id } = req.params;
      const follower = await Follower.findByIdAndDelete(id);
      res.status(200).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
