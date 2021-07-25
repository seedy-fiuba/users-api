const Joi = require('joi');
const constants = require('./utils/constants');

const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		lastName: Joi.string().min(3).max(255).required(),
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
		role: Joi.string().valid('sponsor', 'entrepreneur', 'reviewer', 'admin').required(),
	});
	return schema.validate(data);
};

const updateUserValidator = (data) => {
	const schema = Joi.object({
		description: Joi.string(),
		firebaseToken: Joi.string(),
		status: Joi.string().valid(constants.userStatus.available, constants.userStatus.blocked)
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
		'authToken': Joi.string().min(6).max(1024).required(),
	});
	return schema.validate(data);
};

const reviewValidator = (data) => {

	const schema = Joi.object({
		'reviewerId': Joi.number().min(0).required(),
		'projectId': Joi.number().min(0).required()
	});
	return schema.validate(data);
};

const searchReviewValidator = (data) => {
	const schema = Joi.object({
		'reviewerId': Joi.number(),
		'status': Joi.string().valid('pending','approved','rejected')
	});
	return schema.validate(data);
};

const searchUsersValidator = (data) => {
	const schema = Joi.object({
		'size': Joi.number(),
		'page': Joi.number(),
		'role': Joi.string().valid('sponsor', 'entrepreneur', 'reviewer', 'admin')
	});
	return schema.validate(data);
};

const notificationValidation = (data) => {
	const schema = Joi.object({
		'title': Joi.string(),
		'message': Joi.string(),
		'ownerId' : Joi.number(),
		'projectId' : Joi.number()
	});
	return schema.validate(data);
};

module.exports = {
	registerValidation,
	loginValidation,
	authenticateValidation,
	reviewValidator,
	searchReviewValidator,
	searchUsersValidator,
	notificationValidation,
	updateUserValidator
};