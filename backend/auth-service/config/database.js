const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('authdb', 'authuser', 'authpassword', {
  host: 'localhost',
  dialect: 'mysql',
});



// async function initDb() {
//   try {
//     console.log("Connecté à la base de données");

//     const sql = fs.readFileSync('./init.sql', 'utf8');
//     await pool.query(sql);
//     console.log('Script SQL exécuté');

//     // NE PAS fermer le pool ici, sinon tu perds la connexion
//     // await pool.end();
//   } catch (err) {
//     console.error('Erreur SQL :', err);
//   }
// }

// // Appelle cette fonction seulement une fois pour initialiser ta base au démarrage (optionnel)
// initDb();

module.exports = sequelize;