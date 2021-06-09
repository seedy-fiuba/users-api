const { OAuth2Client } = require('google-auth-library');
const responses = require('../utils/responses');
let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const constants = require('../utils/constants');
const jwt = require('jsonwebtoken');
const hash = require('../utils/hashUtil');
var metrics = require('datadog-metrics');

// validation
const { loginValidation, authenticateValidation } = require('../validation');

exports.login = [
	async (req, res, next) => {
		// validate the user
		try {
			const {error} = loginValidation(req.body);

			if (error)
				throw new UserError(constants.error.BAD_REQUEST, error);

			const user =  await UserService.getUserByMail(req.body.email);

			// throw error when email is wrong
			if (!user)
				throw new UserError(constants.error.BAD_REQUEST, 'No user registered with this email.');

			// check for password correctness
			const validPassword = await hash.validatePasswords(req.body.password, user.password);
			if (!validPassword) {
				throw new UserError(constants.error.UNAUTHORIZED_ERROR, 'Password is wrong');
			}

			// create token
			const token = jwt.sign(
				// payload data
				{
					email: user.email,
					id: user.id,
				},
				process.env.TOKEN_SECRET,
				{
					expiresIn: 60 * 60 * 1
				}
			);

			metrics.increment('traditional.login', 1, ['id:' + user.id, 'role:' + user.role]);
			responses.statusOk(res, {
				user: user,
				token: token
			});
		} catch (e) {
			next(e);
		}
	}
];

exports.loginGoogle = [
	(req, res, next) => {
		try {
			const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
			const client = new OAuth2Client(CLIENT_ID);

			googleVerify(req, res, CLIENT_ID, client).catch((error) => {
				console.error(error);
				throw new UserError(constants.error.UNAUTHORIZED_ERROR, error.message);
			});

		} catch (e) {
			next(e);
		}
	}
];

exports.authenticate = [
	async (req, res, next) => {
		try {
			const {error} = await authenticateValidation(req.body);
			if (error) {
				throw new UserError(constants.error.BAD_REQUEST, error.message);
			}

			let token = req.body['authToken'];

			jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
				if (err) {
					return responses.unauthorizedResponse(res, 'unauthorized');
				}

				return responses.statusOk(res, {
					message: 'authorized',
					identity: decoded
				});
			});
		} catch (e) {
			next(e);
		}
	}
];

async function googleVerify(req, res, clientId, client) {
	const ticket = await client.verifyIdToken({
		idToken: req.body.idToken,
		audience: clientId,
	});
	const payload = ticket.getPayload();
	var registering = false;

	var userData = await UserService.getUserByMail(payload['email']);
	if (!userData) {
		const userPayload = {
			name: payload['given_name'],
			lastName: payload['family_name'],
			email: payload['email'],
			password: '-',
			role: '-' //TODO: Set role
		};

		userData = await UserService.createUser(userPayload);
		registering = true;
	}

	const token = jwt.sign(
		{
			name: userData.name,
			id: userData._id,
		},
		process.env.TOKEN_SECRET,
		{
			expiresIn: 30
		}
	);

	var metricKey;
	if (registering) {
		metricKey = 'federated.register';
	} else {
		metricKey = 'federated.login';
	}
	metrics.increment(metricKey, 1, ['id:' + userData._id, 'role:' + userData.role]);

	responses.statusOk(res, {'user': userData, 'token': token});
}