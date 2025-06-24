const Comment = require("../models/comment.model");
const axios = require("axios");

// Fonction pour créer un commentaire
exports.createComment = async (req, res) => {
  const { post_id, content } = req.body;
  const user_id = req.user.user_id; // récupéré via le middleware

  if (!post_id || !user_id || !content) {
    return res.status(400).send("Post ID, User ID and content are required");
  }

  try {
    const newComment = new Comment({ post_id, user_id, content });
    await newComment.save();

    // --- Notification ---
    try {
      // Récupère l'auteur du post
      const postRes = await axios.get(`http://posts:3000/${post_id}`);
      const postOwnerId = postRes.data.userId;
      if (postOwnerId && postOwnerId !== user_id) {
        const userRes = await axios.get(`http://auth-service:5000/user/${user_id}`);
        const username = userRes.data.user?.username || "Quelqu'un";
        await axios.post("http://notification-service:4004/notification", {
          userId: postOwnerId,
          type: "comment",
          message: `${username} a commenté votre post.`,
        });
      }
    } catch (notifErr) {
      console.error("Erreur notification commentaire :", notifErr.message);
    }

    res.status(201).json(newComment); // Retourne le commentaire créé
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du commentaire", error: err });
  }
};

// Fonction pour récupérer tous les commentaires
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments); // Retourne tous les commentaires
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error: err });
  }
};

// Fonction pour récupérer les commentaires d'un post spécifique avec infos utilisateur
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ post_id: postId });
    if (comments.length === 0) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour ce post" });
    }

    // Enrichir chaque commentaire avec les infos utilisateur
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const userRes = await axios.get(
            `http://auth-service:5000/user/${comment.user_id}`
          );
          return {
            ...comment.toObject(),
            user: {
              username: userRes.data.user?.username || "Utilisateur",
              image: userRes.data.user?.image || null,
            },
          };
        } catch (e) {
          console.error("Erreur lors de la récupération de l'utilisateur pour le commentaire", comment._id, e.message);
          return {
            ...comment.toObject(),
            user: { username: "Utilisateur", image: null },
          };
        }
      })
    );

    res.status(200).json(enrichedComments);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error: err });
  }
};

// Fonction pour répondre à un commentaire
exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { post_id, content } = req.body;
  const user_id = req.user.user_id; // récupéré via le middleware

  if (!user_id || !content) {
    return res.status(400).json({ message: "user_id et content sont requis" });
  }

  try {
    // On suppose que le champ parent_id existe dans le modèle (à ajouter si besoin)
    const reply = new Comment({
      post_id,
      user_id,
      content,
      parent_id: commentId,
    });
    await reply.save();

    // --- Notification pour la réponse ---
    try {
      // Récupère le commentaire parent pour trouver l'auteur à notifier
      const parentComment = await Comment.findById(commentId);
      if (parentComment && parentComment.user_id !== user_id) {
        const userRes = await axios.get(`http://auth-service:5000/user/${user_id}`);
        const username = userRes.data.user?.username || "Quelqu'un";
        await axios.post("http://notification-service:4004/notification", {
          userId: parentComment.user_id,
          type: "comment-reply",
          message: `${username} a répondu à votre commentaire.`,
        });
      }
    } catch (notifErr) {
      console.error("Erreur notification réponse commentaire :", notifErr.message);
    }

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la réponse", error: err });
  }
};

// Fonction pour supprimer une réponse à un commentaire
exports.deleteReply = async (req, res) => {
  const { commentId, replyId } = req.params;
  try {
    // On vérifie que la réponse correspond bien à ce commentaire parent
    const reply = await Comment.findOneAndDelete({ _id: replyId, parent_id: commentId });
    if (!reply) {
      return res.status(404).json({ message: "Réponse non trouvée ou n'appartient pas à ce commentaire" });
    }
    res.status(200).json({ message: "Réponse supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la réponse", error: err });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error: err });
  }
};
