const bcrypt = require('bcryptjs');

exports.encrypt = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

exports.validatePasswords = async(p1, p2) => {
	return await bcrypt.compare(p1, p2);
};