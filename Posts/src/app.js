const express = require("express");
const cors = require("cors");
const verifyToken = require('./middlewares/verifyToken');
const postsRoutes = require("./routes/posts.routes");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

const port = 3000;

app.use(cors({
  origin: ["http://localhost:5173", "https://Zing.com", "http://localhost", "http://localhost:80", "https://zing.com", "http://10.64.128.76:5173"], // ← ajoute tous les domaines que tu utilises
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/posts",verifyToken, postsRoutes);

mongoose
  .connect(
    "mongodb://" +
      process.env.MONGO_HOST +
      ":" +
      process.env.MONGO_PORT +
      "/" +
      process.env.MONGO_DATABASE_NAME
  )
  .then(() => {
    console.log("MongoDB connected !");
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
