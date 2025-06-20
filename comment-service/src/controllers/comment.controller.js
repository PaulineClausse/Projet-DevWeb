const Comment = require("../models/comment.model");
const axios = require("axios");

// Fonction pour créer un commentaire
exports.createComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;

  if (!post_id || !user_id || !content) {
    return res.status(400).send("Post ID, User ID and content are required");
  }

  try {
    const newComment = new Comment({ post_id, user_id, content });
    await newComment.save();
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
          // Utilise le nom du service Docker pour auth-service
          const userRes = await axios.get(
            `http://auth-service:5000/user/${comment.user_id}`
          );
          return {
            ...comment.toObject(),
            user: {
              username: userRes.data.user.username,
              image: userRes.data.user.image,
            },
          };
        } catch (e) {
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
  const { post_id, user_id, content } = req.body;

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