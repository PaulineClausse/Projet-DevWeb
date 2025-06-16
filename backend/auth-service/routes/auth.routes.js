const router = require('express').Router();
const loginController = require('../controllers/auth.controller');

router.post('/login', loginController.login);
router.post('/auth', loginController.authenticate);
router.post('/register', loginController.register);
module.exports = router