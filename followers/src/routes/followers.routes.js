const express = require("express");

const router = express.Router();

const followersController = require("../controllers/followers.controller.js");

// Récupérer tous les followers (optionnel, pour debug/admin)
router.get("/", followersController.getAllFollowers);

// Récupérer les followers d'un utilisateur
router.get("/user/:userId", followersController.getOneFollower);

// Vérifier si followerId suit followingId
router.get("/is-following/:followerId/:followingId", followersController.isFollowing);

// Suivre un utilisateur
router.post("/follow", followersController.createFollower);
// Body attendu : { followerId, followingId }

// Désuivre un utilisateur
router.delete("/unfollow", followersController.deleteFollower);
// Body attendu : { followerId, followingId }

module.exports = router;