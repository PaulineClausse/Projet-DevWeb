const router = require('express').Router();
const loginController = require('../controllers/auth.controller');
const checkRoles = require('../middlewares/checkRoles');

router.post('/login', loginController.login);
router.get('/auth', loginController.authenticate);
router.post('/register', loginController.register);
router.post('/update', loginController.update);
router.get('/user', loginController.getUser);
router.delete('/delete', loginController.deleteUser);
router.get('/listUsers', loginController.getAllUsers);

router.get('/admin/users', checkRoles(['admin', 'moderateur']), userController.getAllUsers);// Autoriser uniquement les admins et modérateurs

module.exports = router