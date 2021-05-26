var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	res.send('SeedyFiuba :)');
});

module.exports = router;