// src/app.js
const express = require("express");
const mongoose = require("mongoose");
const likeRoutes = require("./routes/like.routes");
require("dotenv").config(); // Charger les variables d'environnement

const app = express();
const port = process.env.PORT || 4002; // Utilise le port depuis .env ou le port 4002 par défaut

// Middleware
app.use(express.json()); // Pour analyser le JSON dans le corps de la requête
app.use("/api/likes", likeRoutes);  // Définir les routes pour les likes

// Connexion à MongoDB avec gestion d'erreurs et options supplémentaires
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connecté !");
    app.listen(port, () => {
      console.log(`Serveur des likes en cours sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err.message);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  });

// Gestion des erreurs globales pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Gestion des erreurs générales (pour les routes et autres)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log l'erreur
  res.status(500).json({ message: "Something went wrong!" });  // Répond avec une erreur générale
});
