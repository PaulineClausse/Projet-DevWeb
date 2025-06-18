const http = require("http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const sequelize = require("../config/database");
require("dotenv").config();

const PORT = 5000;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["email", "password", "username", "user_id"],
    });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      biography: user.biography,
      image: user.image,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_JWT_KEY);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Connexion réussie", accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

exports.register = async (req, res) => {
  const { email, password, username, name, first_name, biography, image } =
    req.body;

  // Vérifie que les champs sont bien remplis
  if (!email || !password || !username || !name || !first_name) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const user = await User.findOne({
      where: { email },
      attributes: ["email", "username"], // récupérer uniquement les colonnes email et password
    });
    if (user) {
      return res.status(409).json({ message: "Utilisateur déjà existant" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      first_name,
      biography,
      image,
    });

    return res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", userId: newUser.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

exports.authenticate = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);

    const user = await User.findOne({
      where: { email: decoded.email },
      attributes: [
        "email",
        "password",
        "username",
        "user_id",
        "name",
        "first_name",
        "biography",
        "image",
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Authentification réussie
    req.user = user;
    return res.status(200).json({
      message: "Authentification réussie",
      user: {
        email: user.email,
        username: user.username,
        user_id: user.user_id,
        name: user.name,
        first_name: user.first_name,
        biography: user.biography,
        image: user.image,
      },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token invalide ou expiré", error: err.message });
  }
};
exports.update = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou mal formaté" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // On va décoder le TOKEN pour avoir les informations (ID)
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
    const userId = decoded.user_id;

    const { email, username, name, first_name, password } = req.body;

    // L'objet qui va recevoir les nouvelles valeurs
    const updateFields = {};
    if (email) updateFields.email = email;
    if (username) updateFields.username = username;
    if (name) updateFields.name = name;
    if (first_name) updateFields.first_name = first_name;
    if (biography) updateFields.biography = biography;
    if (image) updateFields.image = image;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const [updatedRows] = await User.update(updateFields, {
      where: { user_id: userId },
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Aucune mise à jour effectuée ou utilisateur non trouvé.",
      });
    }

    return res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès." });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Token invalide ou erreur de mise à jour.",
      error: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { user_id, email } = req.query;

    if (!user_id || !email) {
      return res.status(400).json({ message: "user_id et email sont requis." });
    }

    const deletedCount = await User.destroy({
      where: { user_id, email },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé ou déjà supprimé." });
    }

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
