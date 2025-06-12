// src/controllers/like.controller.js
const Like = require("../models/like.model");
const Post = require("../models/post.model");  

// Fonction pour liker un post
exports.addLike = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    // Vérifier si le post existe
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà liké ce post
    const existingLike = await Like.findOne({ post_id, user_id });
    if (existingLike) {
      return res.status(400).json({ message: "Vous avez déjà liké ce post" });
    }

    // Ajouter un nouveau like
    const newLike = new Like({ post_id, user_id });
    await newLike.save();

    // Mettre à jour le compteur de likes du post
    post.likes_count += 1;
    await post.save();

    res.status(201).json({ message: "Post liké avec succès", like: newLike });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du like", error: err });
  }
};

// Fonction pour récupérer le nombre de likes d'un post
exports.getLikesCount = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ likes_count: post.likes_count });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du nombre de likes", error: err });
  }
};
