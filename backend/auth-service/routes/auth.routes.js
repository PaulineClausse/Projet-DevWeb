const authController = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post("/register", authController.register);  
  app.get("/login", authController.login);
  app.get("/auth", authController.authenticate);
};

