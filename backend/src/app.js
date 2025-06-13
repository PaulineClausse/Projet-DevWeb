require("dotenv").config();

const express = require('express')
const app = express()
const pool = require('./config/database');
const cors = require('cors');
const AuthRouter = require('../auth-service/routes/auth.routes')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/', AuthRouter);

app.listen(5000,()=>{
    console.log("service auth démarré sur le port 5000");
    
})
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