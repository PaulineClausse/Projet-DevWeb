// backend/src/middlewares/requiredFields.middleware.js
module.exports = function requiredFields(fields) {
  return function (req, res, next) {
    // On vérifie si chaque champ requis est présent dans la requête
    const missingFields = fields.filter(field => !req.body[field]);

    // Si des champs sont manquants, on renvoie une erreur
    if (missingFields.length) {
      return res.status(400).json({
        message: `Les champs suivants sont manquants : ${missingFields.join(', ')}`,
      });
    }

    // Si tout est ok, on passe au middleware suivant
    next();
  };
};
