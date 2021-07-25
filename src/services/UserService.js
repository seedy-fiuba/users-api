const User = require('../models/User');
const constants = require('../utils/constants');
const UserError = require('../exceptions/UserError');
const hash = require('../utils/hashUtil');

const createUser = async (data, wallet) => {
	const userData = await getUserByMail(data.email);
	if (userData)
		throw new UserError(constants.error.CONFLICT_ERROR, 'User already registered');

	let password = await hash.encrypt(data.password);

	const user = new User({
		name: data.name,
		lastName: data.lastName,
		email: data.email,
		password: password,
		role: data.role,
		walletAddress: wallet.address,
		walletPrivateKey: wallet.privateKey,
		status: constants.userStatus.available
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
		// console.log(error);
		throw new UserError(constants.error.UNEXPECTED_ERROR, 'Couldnt save user');
	}
};

const getUserByMail = async (email) => {
	return User.findOne({ email: email });
};

const getUsers = async (params) => {
	const limit = params.size ? + params.size : 10;
	const offset = params.page ? params.page * limit : 0;
	let query = {};

	if (params.role) {
		query.role = params.role;
	}

	return User.paginate(query, {offset: offset, limit: limit, select: '-password'});
};

const getUserById = async (id) => {
	return User.findById(id).select('-password');
};

const updateUserById = async(id, newValues) => {
	return User.findByIdAndUpdate(
		{_id: id },
		newValues,
		{new: true});
};

module.exports = {
	createUser,
	getUserByMail,
	getUsers,
	getUserById,
	updateUserById
};

