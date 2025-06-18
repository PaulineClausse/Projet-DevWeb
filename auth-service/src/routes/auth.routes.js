const express = require("express");

const router = express.Router();
const loginController = require("../controllers/auth.controller");
const jwt = require("jsonwebtoken");

router.get("/auth", loginController.authenticate);
router.post("/login", loginController.login);
router.get("/user/:id", loginController.getUser);
router.post("/register", loginController.register);
router.post("/update", loginController.update);
router.delete("/delete", loginController.deleteUser);

module.exports = router;
