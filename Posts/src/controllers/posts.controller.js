const postsList = [];
const Post = require("../models/post.model");

module.exports = {
  getOnePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(400).send("Post not found");
      }
      res.status(200).json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  userPost: async (req, res) => {
    try {
      const { id } = req.params;
      const posts = await Post.find({ userId: Number(id) });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  putPost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
      if (!post) {
        return res.status(400).send("Post not found");
      }
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createPost: async (req, res) => {
    const { title, content, image } = req.body;
    const userId = req.user.user_id;
    if (!title || !content)
      return res.status(400).send("Title and content are required");

    try {
      const newPost = new Post({ title, content, image: image || false, userId });
      await newPost.save();
      postsList.push(newPost);

      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};