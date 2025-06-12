// src/controllers/comment.controller.js
const axios = require('axios');
const Comment = require('../models/comment.model');

// Fonction pour créer un commentaire
exports.createComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;

  try {
    // Vérifier si le post existe via une requête à l'API des posts
    const postResponse = await axios.get(`http://posts-service:3000/api/posts/${post_id}`);

    if (!postResponse.data) {
      // Si le post n'existe pas, retourner une erreur
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Créer un commentaire si le post existe
    const newComment = new Comment({
      post_id,
      user_id,
      content
    });

    await newComment.save();
    res.status(201).json(newComment);  // Retourner le commentaire créé
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
  }
};
