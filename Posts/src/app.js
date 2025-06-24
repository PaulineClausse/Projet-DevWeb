const express = require("express");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts.routes");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const port = 3000;
const path = require("path");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://zing.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/posts", verifyToken, postsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const mongoUri =
  process.env.MONGO_URI ||
  "mongodb://" +
    process.env.MONGO_HOST +
    ":" +
    process.env.MONGO_PORT +
    "/" +
    process.env.MONGO_DATABASE_NAME;

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
