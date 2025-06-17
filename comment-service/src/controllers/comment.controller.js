const Comment = require("../models/comment.model");

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

// Fonction pour récupérer les commentaires d'un post spécifique
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ post_id: postId });
    if (comments.length === 0) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour ce post" });
    }
    res.status(200).json(comments); // Retourne les commentaires du post
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error: err });
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