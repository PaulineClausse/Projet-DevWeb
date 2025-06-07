const tasksList = [];
const Task = require("../models/task.model");

module.exports = {
  createTask: async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).send("Title and content are required");

    try {
      const newTask = new Task({ title, content });
      await newTask.save();
      tasksList.push(newTask);

      res.status(201).send("Task created successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  putTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndUpdate(id, req.body);
      if (!task) {
        return res.status(400).send("Task not found");
      }
      const updatedTask = await Task.findById(id);
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndDelete(id, req.body);
      if (!task) {
        return res.status(400).send("Task not found");
      }
      const deletedTask = await Task.findById(id);
      res.status(200).json("Task deleted");
    } catch (err) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOneTask: async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await Task.findById(id);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
