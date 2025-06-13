const express = require("express");

const router = express.Router();

const tasksController = require("../../../src/controllers/tasks.controller.js");

const requiredFields = require("../../../src/middlewares/requiredFields.middleware.js");

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
