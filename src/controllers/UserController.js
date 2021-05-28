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
        const { page, size } = req.query;
        await UserService.getUsers(page, size)
            .then((result) => {
                let bodyResponse = {
                    totalItems: result.totalDocs,
                    users: result.docs,
                    totalPages: result.totalPages,
                    currentPage: result.page - 1
                }

                return responses.statusOk(res, bodyResponse);
            }).catch((err) => {
                throw new UserError(constants.error.UNEXPECTED_ERROR, err);
            });
    } catch (e) {
        next(e);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        // TODO: validate user info based on token
        let user = await UserService.getUserById(req.params.id);
        if (!user)
            throw new UserError(constants.error.NOT_FOUND, "User not found");
        return responses.statusOk(res, user);
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