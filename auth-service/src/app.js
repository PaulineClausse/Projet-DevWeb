require("dotenv").config();

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
// const pool = require('../auth-service/config/database');
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes");

app.use(cors({
  origin: ["http://localhost:5173", "http://Zing.com", "http://localhost", "http://localhost:80", "http://zing.com", "http://10.64.128.76:5173"], // ← ajoute tous les domaines que tu utilises
  credentials: true
}));

app.use(cookieParser());
// parse requests of content-type - application/json
app.use(express.json());



// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/", AuthRouter);

app.listen(5000, () => {
  console.log("service auth démarré sur le port 5000");
});
