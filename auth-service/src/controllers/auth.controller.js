const http = require("http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
require("dotenv").config();

const { User, Roles } = require("../models"); // Assure-toi que tu as bien les imports

const PORT = 5000;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["email", "password", "username", "user_id", "first_name"], //'image'
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

      first_name: user.first_name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_JWT_KEY);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
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

  if (!email || !password || !username || !name || !first_name) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      first_name,
      biography,
      image,
    });

    // Recherche du rôle "user"
    const userRole = await Roles.findOne({ where: { role_name: "user" } });

    if (!userRole) {
      return res
        .status(500)
        .json({ message: 'Rôle par défaut "user" introuvable' });
    }

    // Association via la méthode Sequelize générée par la relation belongsToMany
    await newUser.addRole(userRole);

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: newUser.user_id,
      user_role: userRole.role_name,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
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
  try {
    const userId = req.user.user_id;

    const { email, username, name, first_name, biography, password } = req.body;

    // L'objet qui va recevoir les nouvelles valeurs
    const updateFields = {};
    if (email) updateFields.email = email;
    if (username) updateFields.username = username;
    if (name) updateFields.name = name;
    if (first_name) updateFields.first_name = first_name;
    if (biography) updateFields.biography = biography;
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
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id est requis." });
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Supprimer les associations user <-> roles
    await user.setRoles([]); // supprime les liens dans la table pivot

    // Supprimer l'utilisateur
    await user.destroy();

    return res.status(200).json({
      message: "Utilisateur et associations rôles supprimés avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// A GARDER EN COMMENTAIRES POUR UTILISATION FUTUR POUR RETOURNER LE ROLE

// const user = await User.findOne({
//       where: { user_id: userId },
//       attributes: ['user_id', 'email', 'username', 'name', 'first_name'],
//       include: [{
//         model: Roles,
//         attributes: ['role_name'], // On ne veut que le nom du rôle
//         through: { attributes: [] } // Supprime les métadonnées de la table intermédiaire
//       }]
//     });
