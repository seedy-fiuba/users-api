var express = require("express");
var router = express.Router();
const UserController = require("../controllers/UserController")

router.get("/", (req, res) => {
    res.send('SeedyFiuba :)')
});

router.post("/user", UserController.saveUser);

module.exports = router;