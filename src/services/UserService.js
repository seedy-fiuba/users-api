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

const getUsers = async (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? page * limit : 0;

	return User.paginate({}, {offset: offset, limit: limit, select: '-password'});
}

const getUserById = async (id) => {
	return User.findById(id).select('-password');
}

module.exports = {
	createUser,
	getUserByMail,
	getUsers,
	getUserById
};

