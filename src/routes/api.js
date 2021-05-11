var express = require("express");

var router = express.Router();

router.get('/ping', (req, res) => {
    res.send('pong')
})

module.exports = router;