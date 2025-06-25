require("dotenv").conficonst;
const path = require("path");
const express = require("express");
const app = express();
const ImageRouter = require("./routes/image.routes");
const cookieParser = require("cookie-parser");
// const pool = require('../auth-service/config/database');
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");
const multer = require("multer");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://zing.com"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);
// parse requests of content-type - application/json
app.use(express.json());

app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/", AuthRouter);
app.use("/", ImageRouter);

app.listen(5000, () => {
  console.log("service auth démarré sur le port 5000");
});
