const router = require('express').Router();
const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google_login', AuthController.loginGoogle);
router.post('/authenticate', AuthController.authenticate);

module.exports = router;