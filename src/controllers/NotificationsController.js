const admin = require('firebase-admin');
const responses = require('../utils/responses');
const UserError = require('../exceptions/UserError');
const validator = require('../validation');
const UserService = require('../services/UserService');

const serviceAccount = require('../seedyfiuba-firebase-adminsdk-tsrgy-5ddcc0249d.json');
const constants = require('../utils/constants');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

exports.sendNotification = async (req, res, next) => {
	try {
		let {value, error} = await validator.notificationValidation(req.body);

		// throw validation errors
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		let owner = await UserService.getUserById(value.ownerId);

		if (!owner)
			throw new UserError(constants.error.NOT_FOUND, 'User not found');

		const message = {
			data: {
				projectId: value.projectId.toString()
			},
			notification: {
				title: value.title,
				body: value.message
			},
			//topic: 'projects', todo: ver si hace falta incluir topic
			token: owner.firebaseToken
		};

		// Send a message to devices subscribed to the provided topic.
		admin.messaging().send(message)
			.then((response) => {
				// Response is a message ID string.
				console.log('Successfully sent message:', response);
			})
			.catch((error) => {
				console.log('Error sending message:', error);
			});

		return responses.statusOk(res, 'Message sent');
	} catch (e) {
		next(e);
	}
};
