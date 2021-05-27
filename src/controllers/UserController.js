let UserService = require('../services/UserService');
const { registerValidation } = require('../validation');
const UserError = require('../exceptions/UserError');
const constants = require('../utils/constants');
const responses = require('../utils/responses');

exports.createUser = async (req, res, next) => {
    // validate the user
    try {
        const {error} = await registerValidation(req.body);

        // throw validation errors
        if (error) {
            throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
        }

        const userData = await UserService.createUser(req.body);
        return responses.statusOk(res, userData);
    } catch (e) {
        next(e);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};