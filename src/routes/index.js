var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
	res.send('SeedyFiuba :)');
});

<<<<<<< HEAD

router.post("/user", UserController.saveUser);
=======
router.post('/user', UserController.saveUser);
>>>>>>> f4da66ee6db57f1ab286cad87c631261acaccbec

module.exports = router;