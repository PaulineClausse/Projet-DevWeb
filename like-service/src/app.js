// src/app.js
const express = require("express");
const mongoose = require("mongoose");
const likeRoutes = require("./routes/like.routes");
require("dotenv").config(); // Charger les variables d'environnement

const app = express();
const port = 4002; // Port pour le service des likes

// Middleware
app.use(express.json());
app.use("/api/likes", likeRoutes);  // Définir les routes pour les likes

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connecté !");
    app.listen(port, () => {
      console.log(`Serveur des likes en cours sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Erreur de connexion à MongoDB :", err);
  });
