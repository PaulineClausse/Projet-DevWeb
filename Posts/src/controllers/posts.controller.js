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
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id, req.body);
      if (!post) {
        return res.status(400).send("Post not found");
      }
      const deletedPost = await Post.findById(id);
      res.status(200).json("Post deleted");
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  },

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Retrieves all posts for a specific user.
   *
   * @param {Object} req - The request object, containing user ID in params.
   * @param {Object} res - The response object, used to send back the posts.
   * @returns {void} - Sends a JSON response with the list of posts or an error message.
   */

  /*******  91844153-e7cc-4663-9cc9-f718ae972b17  *******/
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
      const post = await Post.findByIdAndUpdate(id, req.body);
      if (!post) {
        return res.status(400).send("Post not found");
      }
      const updatedPost = await Post.findById(id);
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createPost: async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.user_id;
    const image = req.file ? req.file.filename : null;
    if (!title || !content)
      return res.status(400).send("Title and content are required");

    try {
      const newPost = new Post({ title, content, image, userId });
      await newPost.save();
      postsList.push(newPost);

      res.status(201).send("Post created successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};