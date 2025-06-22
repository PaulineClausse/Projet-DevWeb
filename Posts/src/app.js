const express = require("express");
const cors = require("cors");
const VerifyToken = require("./middlewares/VerifyToken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); 

require("dotenv").config();
const app = express();

const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/posts", VerifyToken, require("./routes/posts.routes"));

// Correction : connexion avec MONGO_URI si disponible, sinon fallback sur les variables séparées
const mongoUri =
  process.env.MONGO_URI ||
  ("mongodb://" +
    process.env.MONGO_HOST +
    ":" +
    process.env.MONGO_PORT +
    "/" +
    process.env.MONGO_DATABASE_NAME);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected !");
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });