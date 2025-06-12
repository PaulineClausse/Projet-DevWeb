const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté !");
    app.listen(port, () => {
      console.log(`Écoute sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
