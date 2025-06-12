const mongoose = require('mongoose');

// Définition du schéma pour un commentaire
const commentSchema = new mongoose.Schema({
  post_id: { type: String, required: true },  // Référence du post
  user_id: { type: String, required: true },  // Référence de l'utilisateur
  content: { type: String, required: true },  // Contenu du commentaire
  date: { type: Date, default: Date.now }     // Date de création
});

// Créer le modèle Comment à partir du schéma
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
