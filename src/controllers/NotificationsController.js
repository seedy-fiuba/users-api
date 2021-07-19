var admin = require('firebase-admin');
const responses = require('../utils/responses');
const UserError = require('../exceptions/UserError');
const notificationValidation = require('../validation');

//var serviceAccount = require('seedyfiuba-firebase-adminsdk-tsrgy-5ddcc0249d.json');
const constants = require('../utils/constants');

//admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

exports.sendNotification = async (req, res, next) => {
	try {
		let {value, error} = await notificationValidation(req.body);

		// throw validation errors
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		const message = {
			notification: {
				title: value.title,
				body: value.message
			},
			topic: 'projects'
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
