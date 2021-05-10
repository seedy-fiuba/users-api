const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// import routes
const authRoutes = require("./routes/auth");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//middleware
app.use(express.json()); // for body parser

// route middlewares
app.use("/api/user", authRoutes);
app.listen(8080, () => console.log("server is running..."));

const router = require("express").Router();
module.exports = router;