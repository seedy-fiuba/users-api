'use strict';

const express = require('express');
require("dotenv").config();
const indexRouter = require("./routes/index");
const apiRouter = require('./routes/api');
const mongoose = require('mongoose');
const apiResponse = require("./utils/responses");

// Constants
 const PORT = process.env.PORT || 8080;

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("MongoDB: Connected to %s", MONGODB_URL);
}).catch(err => {
    console.error("MongoDB connect error:", err.message);
    process.exit(1);
})

var db = mongoose.connection;

// App
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Router prefix
app.use("/", indexRouter);
app.use("/api/", apiRouter);

app.listen(PORT, () =>
    console.log(`server is up`)
);

// throw 404 if URL not found
app.all("*", function(req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
    if (err.name == "UnauthorizedError") {
        return apiResponse.unauthorizedResponse(res, err.message);
    }
})

module.exports = app;