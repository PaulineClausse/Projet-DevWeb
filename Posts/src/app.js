const express = require("express");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts.routes");
require("dotenv").config();
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/posts", verifyToken, postsRoutes);

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
