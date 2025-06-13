const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function initDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("Connecté à la base de données");

    const sql = fs.readFileSync('./init.sql', 'utf8');
    await connection.query(sql);
    console.log('Script SQL exécuté');

    await connection.end();
  } catch (err) {
    console.error('Erreur SQL :', err);
  }
}

initDb();
