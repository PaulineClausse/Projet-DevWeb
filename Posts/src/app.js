const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

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

app.use("/api/posts", require("./routes/posts.routes"));

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
