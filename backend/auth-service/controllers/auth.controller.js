const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../src/config/database');
const User = require("../models/user.model");
const fs = require('fs');
const { log } = require('console');
require('dotenv').config();

const PORT = 5000;

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    return res.status(200).json({ message: 'Connexion réussie', token });
  });
};