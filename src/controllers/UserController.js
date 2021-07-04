let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');
const Wallet = require('../services/WalletService');
var metrics = require('datadog-metrics');

const { registerValidation, searchUsersValidator } = require('../validation');

exports.createUser = async (req, res, next) => {
	// validate the user
	try {
		const {error} = await registerValidation(req.body);

		// throw validation errors
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		const wallet = await Wallet.createWallet();
		const userData = await UserService.createUser(req.body, wallet);
		metrics.increment('traditional.register', 1, ['id:' + userData.id, 'role:' + userData.role]);
		return responses.statusOk(res, userData);
	} catch (e) {
		next(e);
	}
};

exports.getUsers = async (req, res, next) => {
    try {
        let {value, error} = await searchUsersValidator(req.query);
        if (error) {
            throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
        }

        await UserService.getUsers(value)
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
			throw new UserError(constants.error.NOT_FOUND, 'User not found');
		return responses.statusOk(res, user);
	} catch (e) {
		next(e);
	}
};


exports.updateUser = async (req, res, next) => {
	try {
		let result = await UserService.updateUserById(req.params.id, req.body.description);
		if (!result) {
			return responses.notFoundResponse(res, 'User not found');
		}
		return responses.statusOk(res, result);

	} catch (e) {
		next(e);
	}
};
/*
exports.deleteUser = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};
*/

