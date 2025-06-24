const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const notificationRoutes = require("./routes/notification.routes");

const app = express();
const port = process.env.PORT || 4004;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://zing.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/notification", notificationRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log("Notification service running on", port)))
  .catch((err) => console.error(err));