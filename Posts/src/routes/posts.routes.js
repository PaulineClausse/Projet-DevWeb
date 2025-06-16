const express = require("express");

const router = express.Router();

const postsController = require("../controllers/posts.controller.js");

router.get("/", postsController.getAllPosts);

router.get("/:id", postsController.getOnePost);

router.post("/", postsController.createPost);

router.delete("/:id", postsController.deletePost);

router.put("/:id", postsController.putPost);

module.exports = router;
