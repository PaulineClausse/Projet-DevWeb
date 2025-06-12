// src/models/comment.model.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,  // Référence au post
    ref: "Post",
    required: true,
  },
  user_id: {
    type: String,
    required: true,  // ID de l'utilisateur qui commente
  },
  content: {
    type: String,
    required: true,  // Contenu du commentaire
  },
  date: {
    type: Date,
    default: Date.now,  // Date de création du commentaire
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
