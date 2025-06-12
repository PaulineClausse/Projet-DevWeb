// src/routes/comment.routes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// Route pour créer un commentaire
router.post('/', commentController.createComment);

module.exports = router;
