// src/controllers/like.controller.js
const Like = require("../models/like.model");

// Fonction pour récupérer la liste des utilisateurs ayant liké un post
exports.getUsersWhoLiked = async (req, res) => {
  const { post_id } = req.params;

  try {
    const likes = await Like.find({ post_id });
    const userIds = likes.map(like => like.user_id);
    res.status(200).json({ users: userIds });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err });
  }
};

// Fonction pour liker un post
exports.addLike = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    // Vérifier si l'utilisateur a déjà liké ce post
    const existingLike = await Like.findOne({ post_id, user_id });
    if (existingLike) {
      return res.status(400).json({ message: "Vous avez déjà liké ce post" });
    }

    // Ajouter un nouveau like
    const newLike = new Like({ post_id, user_id });
    await newLike.save();

    res.status(201).json({ message: "Post liké avec succès", like: newLike });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du like", error: err });
  }
};

// Fonction pour récupérer le nombre de likes d'un post
exports.getLikesCount = async (req, res) => {
  const { post_id } = req.params;

  try {
    const likesCount = await Like.countDocuments({ post_id });
    res.status(200).json({ likes_count: likesCount });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du nombre de likes", error: err });
  }
};