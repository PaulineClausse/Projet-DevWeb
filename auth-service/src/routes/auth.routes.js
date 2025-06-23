const router = require('express').Router();
const loginController = require('../controllers/auth.controller');
const checkRoles = require('../middleware/isNotUser');

router.post('/login', loginController.login);
router.get('/auth', loginController.authenticate);
router.post('/register', loginController.register);
router.post('/update', loginController.update);
router.get('/user', loginController.getUser);
router.delete('/delete', loginController.deleteUser);

router.get('/listUsers', loginController.getAllUsers);

router.get('/admin/users', checkRoles(['admin', 'moderateur']), loginController.getAllUsers);// Autoriser uniquement les admins et modérateurs

//  checkRoles(['admin', 'moderateur']),

module.exports = router