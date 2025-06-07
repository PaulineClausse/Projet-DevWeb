const express = require("express");

const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

const port = 3000;

app.use(express.json());

app.use("/api/tasks", require("./routes/tasks.routes"));

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
