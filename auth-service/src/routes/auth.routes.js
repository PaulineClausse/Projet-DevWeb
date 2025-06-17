const router = require('express').Router();
const loginController = require('../controllers/auth.controller');

router.post('/login', loginController.login);
router.get('/auth', loginController.authenticate);
router.post('/register', loginController.register);
router.post('/update', loginController.update);
router.get('/user', loginController.getUser);
router.delete('/delete', loginController.deleteUser);
module.exports = router