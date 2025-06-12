// src/routes/like.routes.js
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like.controller");

// Route pour liker un post
router.post("/", likeController.addLike);

// Route pour récupérer le nombre de likes d'un post
router.get("/:post_id", likeController.getLikesCount);

module.exports = router;
