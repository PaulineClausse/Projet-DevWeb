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
  console.log("PUTO");
  if (!email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'password'] // récupérer uniquement les colonnes email et password
    });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ message: 'Mot de passe incorrect' });
    // }

    
    if (!password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    return res.status(200).json({ message: 'Connexion réussie' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


exports.register = async (req, res) => {

};