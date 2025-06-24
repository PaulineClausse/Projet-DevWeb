const Like = require("../models/like.model");
const axios = require("axios");

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

// Fonction pour liker ou unliker un post
exports.toggleLike = async (req, res) => {
  const user_id = String(req.user.user_id);
  const { post_id } = req.body;

  try {
    const existingLike = await Like.findOne({ post_id, user_id });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: "Like supprimé" });
    }

    const newLike = new Like({ post_id, user_id });
    await newLike.save();

    // --- Notification ---
    try {
      // Récupère l'auteur du post
      const postRes = await axios.get(`http://posts:3000/api/posts/${post_id}`);
      const postOwnerId = String(postRes.data.userId);
      if (postOwnerId && postOwnerId !== user_id) {
        // Récupère le username de l'utilisateur qui like
        const userRes = await axios.get(`http://auth-service:5000/user/${user_id}`);
        const username = userRes.data.user?.username || "Quelqu'un";
        await axios.post("http://notification-service:4004/notification", {
          userId: postOwnerId,
          type: "like",
          message: `${username} a liké votre post.`,
        });
      }
    } catch (notifErr) {
      console.error("Erreur notification like :", notifErr.message);
    }

    res.status(201).json({ message: "Post liké", like: newLike });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du traitement du like", error: err });
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

// Fonction pour récupérer les posts likés par un utilisateur
exports.getLikedPostsByUser = async (req, res) => {
  const user_id = String(req.user.user_id);
  try {
    const likes = await Like.find({ user_id });
    const likedPosts = likes.map(like => like.post_id);
    res.status(200).json({ likedPosts });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des posts likés", error: err });
  }
};