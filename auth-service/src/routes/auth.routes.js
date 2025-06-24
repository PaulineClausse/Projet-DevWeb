const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const loginController = require("../controllers/auth.controller");
const jwt = require("jsonwebtoken");
const checkRoles = require('../middlewares/isNotUser');

router.get("/auth", loginController.authenticate);
router.post("/login", loginController.login);
router.get("/user/:id", loginController.getUser);
router.post("/register", loginController.register);
router.put("/update", authMiddleware, loginController.update);
router.delete("/delete", loginController.deleteUser);

// Autoriser uniquement les admins et modérateurs
router.get('/admin/users', checkRoles(['admin', 'moderateur']), loginController.getAllUsers);

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Déconnexion réussie" });
});

module.exports = router;
