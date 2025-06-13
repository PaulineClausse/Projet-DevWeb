const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const db = require('../../src/config/database');
const fs = require('fs');
const { log } = require('console');


//await User.create({ username: 'bob', password: '1234' });

exports.register = (req, res) => {
  try {
    const [result] = db.query(
      `INSERT INTO users (name, first_name, username, email, phone, biography, password, date_naissance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, first_name, username, email, phone, biography, password, date_naissance]
    );
    return res.status(201).json({
      "msg": "New User created !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = User_DB.find((u) => u.username === username && bcrypt.compareSync(password, u.password));
  if (user) {
    const accessToken = jwt.sign(
      {
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 120
      },
      process.env.ACCESS_JWT_KEY
    );

    return res.status(200).json({ message: "You are now connected!", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
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

    const { username, password } = req.body;
    const user = User_DB.find((u) => u.username === username && bcrypt.compareSync(password, u.password));
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
