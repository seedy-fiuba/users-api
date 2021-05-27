const User = require('../models/User');
const constants = require('../utils/constants');
const UserError = require('../exceptions/UserError');
const hash = require('../utils/hashUtil');

const createUser = async (data) => {
	const userData = await getUserByMail(data.email);
	if (userData)
		throw new UserError(constants.error.CONFLICT_ERROR, 'User already registered');

	let password = await hash.encrypt(data.password);

	const user = new User({
		name: data.name,
		lastName: data.lastName,
		email: data.email,
		password: password,
		role: data.role
	});

	try {
		const savedUser = await user.save(); //save user in database
		return {
			id: savedUser._id,
			name: savedUser.name,
			lastName: savedUser.lastName,
			email: savedUser.email,
			role: savedUser.role
		};
	} catch (error) {
		throw new UserError(constants.error.UNEXPECTED_ERROR, 'Couldnt save user');
	}
};

const getUserByMail = async (email) => {
	return User.findOne({ email: email });
};

module.exports = {
	createUser,
	getUserByMail
};

