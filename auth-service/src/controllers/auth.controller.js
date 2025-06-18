require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { User, Roles } = require('../models'); // Assure-toi que tu as bien les imports



const PORT = 5000;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'password', 'username', 'user_id', 'first_name']//'image'
    });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    }

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_JWT_KEY
    );


    return res.status(200).json({ message: 'Connexion réussie', accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


exports.register = async (req, res) => {
  const { email, password, username, name, first_name, biography} = req.body;

  if (!email || !password || !username || !name || !first_name) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      first_name,
      biography
    });

    // Recherche du rôle "user"
    const userRole = await Roles.findOne({ where: { role_name: 'user' } });

    if (!userRole) {
      return res.status(500).json({ message: 'Rôle par défaut "user" introuvable' });
    }

    // Association via la méthode Sequelize générée par la relation belongsToMany
    await newUser.addRole(userRole);

    return res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser.user_id, user_role: userRole.role_name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.authenticate = async (req, res) => {
  let authHeader = req.headers["authorization"];

  // Vérification que l'en-tête existe et suit le format "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou mal formaté" });
  }

  // Extraction du token sans le préfixe "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);

    const user = await User.findOne({
      where: { user_id: decoded.user_id },
      attributes: ['user_id', 'email', 'username', 'name', 'first_name']
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Authentification réussie
    req.user = user;
    return res.status(200).json({ message: "Authentification réussie", user });

  } catch (err) {
    
    return res.status(401).json({ message: "Token invalide ou expiré", error: err.message });
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
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const [updatedRows] = await User.update(updateFields, {
      where: { user_id: userId }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Aucune mise à jour effectuée ou utilisateur non trouvé." });
    }

    return res.status(200).json({ message: "Utilisateur mis à jour avec succès." });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide ou erreur de mise à jour.", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou mal formaté" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
    const userId = decoded.user_id;

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ['user_id', 'email', 'username', 'name', 'first_name'],
      include: [{
        model: Roles,
        attributes: ['role_name'], // On ne veut que le nom du rôle
        through: { attributes: [] } // Supprime les métadonnées de la table intermédiaire
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide ou expiré", error: err.message });
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

    return res.status(200).json({ message: "Utilisateur et associations rôles supprimés avec succès." });

  } catch (error) {
    console.error("Erreur suppression :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
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