let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');
const Wallet = require('../services/WalletService');
var metrics = require('datadog-metrics');

const { registerValidation, searchUsersValidator, updateUserValidator } = require('../validation');

exports.createUser = async (req, res, next) => {
	// validate the user
	try {
		const {error} = await registerValidation(req.body);

		if (req.header('X-Admin')) {
			req.body.role = 'admin';
		}

		// throw validation errors
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		const wallet = await Wallet.createWallet();

		if(wallet.message != 'ok') {
			throw new UserError(constants.error.UNEXPECTED_ERROR, wallet.message);
		}

		const userData = await UserService.createUser(req.body, wallet.data);
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
					users: result.docs.map(user => retrieveUserByAdmin(user, req)),
					totalPages: result.totalPages,
					currentPage: result.page - 1
				};

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
		return responses.statusOk(res, retrieveUserByAdmin(user, req));
	} catch (e) {
		next(e);
	}
};


exports.updateUser = async (req, res, next) => {
	try {
		let {value, error} = updateUserValidator(req.body);
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		if (!(value['firebaseToken'] || value['description'] || value['status'])) {
			return responses.badRequest(res, 'At least one field is required to update');
		}

		if (req.header('X-Admin') == null && value.status) {
			throw new UserError(constants.error.UNAUTHORIZED_ERROR, 'don\'t have permission to modify the field');
		}

		let result = await UserService.updateUserById(req.params.id, value);
		if (!result) {
			return responses.notFoundResponse(res, 'User not found');
		}

		return responses.statusOk(res, retrieveUserByAdmin(result, req));

	} catch (e) {
		next(e);
	}
};

const retrieveUserByAdmin = (user, req) => {
	if (req.header('X-Admin')) {
		return user;
	}

	user = user.toJSON();
	delete user.status;
	return user;
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

