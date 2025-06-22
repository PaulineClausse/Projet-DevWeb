const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  console.log("🔍 Middleware appelé");
  const token = req.cookies.accessToken; // récupère le cookie

  if (!token) {
    console.log("⛔ Aucun token reçu");
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
    console.log("✅ Token valide:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token invalide");
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = verifyToken;