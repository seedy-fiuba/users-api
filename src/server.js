'use strict';

const express = require('express');
require('dotenv').config();
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const apiResponse = require('./utils/responses');
const constants = require('./utils/constants');

// DB connection
let MONGODB_URL = process.env.MONGODB_URL;

const connectDB = () => {
    mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('MongoDB: Connected to %s', MONGODB_URL);
    }).catch(err => {
        console.error('MongoDB connect error:', err.message);
        process.exit(1);
    });
}

// App
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Router prefix
app.use('/', indexRouter);
app.use('/api/', apiRouter);
app.use('/user', authRoutes);

// throw 404 if URL not found
app.all('*', function(req, res, next) {
    const error = new Error('Page not found');
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res) => {
    if (err) {
        console.error(err.stack);

        if (err.name === constants.error.UNAUTHORIZED_ERROR) {
            return apiResponse.unauthorizedResponse(res, err.message);
        }
        if (err.name === constants.error.BAD_REQUEST) {
            return apiResponse.badRequest(res, err.message);
        }
        if (err.name === constants.error.CONFLICT_ERROR) {
            return apiResponse.conflictError(res, err.message);
        }
        if (err.name === constants.error.NOT_FOUND) {
            return apiResponse.notFoundResponse(res, err.message);
        }
        return apiResponse.unexpectedError(res, err.message);
    }
});

module.exports = {
    app: app,
    connectDB
};