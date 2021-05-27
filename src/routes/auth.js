const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const ProfileController = require('../controllers/ProfileController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google_login', AuthController.loginGoogle);
router.post('/authenticate', AuthController.authenticate);
router.put('/editProfile', ProfileController.editProfile);

module.exports = router;