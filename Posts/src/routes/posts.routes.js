const express = require("express");

const router = express.Router();

const postsController = require("../controllers/posts.controller.js");

const upload = require("../middlewares/upload.js");

router.get("/", postsController.getAllPosts);

router.get("/:id", postsController.getOnePost);

router.post("/create", upload.single("image"), postsController.createPost);

router.delete("/delete/:id", postsController.deletePost);

router.put("/modify/:id", upload.single("image"), postsController.putPost);

router.get("/user/:id", postsController.userPost);

module.exports = router;
