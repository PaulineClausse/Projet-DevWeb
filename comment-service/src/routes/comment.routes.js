const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");

// Route pour créer un commentaire
router.post(
  "/",
  requiredFields(["post_id", "content"]),  // user_id retiré
  commentController.createComment
);

// Route pour créer une réponse à un commentaire
router.post(
  "/:commentId/reply",
  requiredFields(["post_id", "content"]), // user_id retiré
  commentController.replyToComment
);

// Route pour récupérer tous les commentaires
router.get("/", commentController.getAllComments);

// Route pour récupérer les commentaires d'un post spécifique
router.get("/post/:postId", commentController.getCommentsByPost);

router.delete("/:id", commentController.deleteComment);

// Route pour supprimer une réponse à un commentaire
router.delete("/:commentId/reply/:replyId", commentController.deleteReply);

module.exports = router;