const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const commentRoutes = require("./routes/comment.routes");
const authMiddleware = require("./middlewares/VerifyToken");
const cookieParser = require("cookie-parser"); 
require("dotenv").config();

const app = express();
const port = 4001;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); 
app.use("/api/comments", authMiddleware, commentRoutes);

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