// src/routes/comment.routes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

// Route pour créer un commentaire
router.post("/", commentController.createComment);

// Route pour récupérer tous les commentaires
router.get("/", commentController.getAllComments);

// Route pour récupérer les commentaires d'un post spécifique
router.get("/post/:postId", commentController.getCommentsByPost);

module.exports = router;
