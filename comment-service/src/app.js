// src/app.js
const express = require("express");
const mongoose = require("mongoose");
const commentRoutes = require("./routes/comment.routes");
require("dotenv").config();

const app = express();
const port = 4001; // Port pour l'API des commentaires

// Middleware
app.use(express.json());
app.use("/api/comments", commentRoutes); // Routes pour les commentaires

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connecté !");
    app.listen(port, () => {
      console.log(`Serveur des commentaires en cours sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB:", err);
  });
