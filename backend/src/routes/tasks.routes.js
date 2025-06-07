const express = require("express");

const router = express.Router();

const tasksController = require("../controllers/tasks.controller.js");

const requiredFields = require("../middlewares/requiredFields.middleware.js");

router.post(
  "/",
  requiredFields(["title", "content"]),
  tasksController.createTask
);

router.get("/", tasksController.getAllTasks);

router.put(
  "/:id",
  requiredFields(["title", "content", "completed"]),
  tasksController.putTask
);

router.delete("/:id", tasksController.deleteTask);

router.get("/:id", tasksController.getOneTask);

module.exports = router;
