// const http = require('http');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const db = require('../config/database');
// const User = require("../models/user.model");
// const fs = require('fs');
// const { log } = require('console');
// require('dotenv').config();

// const PORT = 5000;

// exports.login = (req, res) => {
//   const { email, password } = req.body;
//   console.log("PUTO");
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Champs manquants' });
//   }

  
//   const sql = 'SELECT * FROM users WHERE email = ?';
//   db.query(sql, [email], (err, results) => {
    
//     if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });

//     if (results.length === 0) {
//       return res.status(401).json({ message: 'Utilisateur non trouvé' });
//     }
    

//     const user = results[0];

//     if (password !== user.password) {
//       return res.status(401).json({ message: 'Mot de passe incorrect' });
//     }

//     return res.status(200).json({ message: 'Connexion réussie', token });
//   });
// };

const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const sequelize = require('../config/database');
require('dotenv').config();

const PORT = 5000;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'password', 'username', 'user_id']
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
  const { email, password, username, name, first_name } = req.body;

  // Vérifie que les champs sont bien remplis
  if (!email || !password || !username || !name || !first_name) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'username'] // récupérer uniquement les colonnes email et password
    });
    if (user) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      first_name
  });

    return res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err });
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

    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'password']
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Authentification réussie
    req.user = user;
    return res.status(200).json({ message: "Authentification réussie", user });

  } catch (err) {
    
    return res.status(401).json({ message: "Token invalide ou expiré", error: err.message });
  }
};