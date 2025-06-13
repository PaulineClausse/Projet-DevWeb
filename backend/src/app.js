const express = require('express')
const app = express()
const pool = require('./config/database');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

require('../auth-service/routes/auth.routes')(app);
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.use(express.json());

// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const [rows] = await pool.query(
//       'INSERT INTO users (username, password) VALUES (?, ?)',
//       [username, password]
//     );
//     res.status(201).json({ id: rows.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });