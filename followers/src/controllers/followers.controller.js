const Follower = require("../models/followers.model");

module.exports = {
  // Récupérer tous les followers (admin/debug)
  getAllFollowers: async (req, res) => {
    try {
      const followers = await Follower.find();
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer tous les followers d'un utilisateur (qui le suit)
  getOneFollower: async (req, res) => {
    try {
      const { userId } = req.params;
      const followers = await Follower.find({ followingId: userId });
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Vérifier si followerId suit followingId
  isFollowing: async (req, res) => {
    const { followerId, followingId } = req.params;
    try {
      const isFollowing = await Follower.exists({ followerId, followingId });
      return res.status(200).json({ isFollowing: !!isFollowing });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Suivre un utilisateur
  createFollower: async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "followerId et followingId requis" });
      }
      const isFollowing = await Follower.exists({ followerId, followingId });
      if (isFollowing) {
        return res.status(400).json({ error: "Follower already exists" });
      }
      const follower = await Follower.create({ followerId, followingId });
      res.status(201).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Désuivre un utilisateur
  deleteFollower: async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "followerId et followingId requis" });
      }
      const follower = await Follower.findOneAndDelete({ followerId, followingId });
      if (!follower) {
        return res.status(404).json({ error: "Follower not found" });
      }
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};