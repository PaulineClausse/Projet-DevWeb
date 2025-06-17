const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");

// Route pour créer un commentaire
router.post(
  "/",
  requiredFields(["post_id", "user_id", "content"]),  // Ajout du middleware ici
  commentController.createComment
);

// Route pour récupérer tous les commentaires
router.get("/", commentController.getAllComments);

// Route pour récupérer les commentaires d'un post spécifique
router.get("/post/:postId", commentController.getCommentsByPost);

router.delete("/:id", commentController.deleteComment);

module.exports = router;
