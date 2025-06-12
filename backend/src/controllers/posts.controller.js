const postsList = [];
const Post = require("../models/post.model");

module.exports = {
  getOnePost: async (req, res) => {
    try {
      const { id } = req.params;
      const posts = await Post.findById(id);
      res.status(200).json(posts);
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

  createPost: async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).send("Title and content are required");

    try {
      const newPost = new Post({ title, content, image: false });
      await newPost.save();
      postsList.push(newPost);

      res.status(201).send("Post created successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
