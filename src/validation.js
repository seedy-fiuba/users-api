const Joi = require('@hapi/joi');

const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		lastName: Joi.string().min(3).max(255).required(),
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
		role: Joi.string().valid('sponsor', 'entrepreneur', 'reviewer').required(),
	});
	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
	});
	return schema.validate(data);
};

const authenticateValidation = (data) => {
	const schema = Joi.object({
		'auth-token': Joi.string().min(6).max(1024).required(),
	});
	return schema.validate(data);
};

module.exports = {
	registerValidation, loginValidation, authenticateValidation
};