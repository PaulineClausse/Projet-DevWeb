// src/models/like.model.js
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",  // Référence au modèle Post
    required: true,
  },
  user_id: {
    type: String,  // ID de l'utilisateur qui aime le post
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
