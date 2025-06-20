module.exports = function requiredFields(fields) {
  return function (req, res, next) {
    const missingFields = fields.filter(field => !req.body[field]);

    if (missingFields.length) {
      return res.status(400).json({
        message: `Les champs suivants sont manquants : ${missingFields.join(', ')}`,
      });
    }

    next();
  };
};
