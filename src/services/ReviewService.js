const Review = require('../models/Review');
let UserService = require('../services/UserService');
const constants = require('../utils/constants');
const UserError = require('../exceptions/UserError');

const createReviewRequest = async(data) => {
	// Validate user exists
	const user = await UserService.getUserById(data.reviewerId);
	if (!user) {
		throw new UserError(constants.error.NOT_FOUND, 'Reviewer not found');
	}
	if (user.role !== 'reviewer') {
		throw new UserError(constants.error.CONFLICT_ERROR, 'User is not a reviewer');
	}

	// Validate request exists
	let reviewRequest = await getReviewRequest(data.reviewerId, data.projectId);
	if (reviewRequest) {
		throw new UserError(constants.error.CONFLICT_ERROR, 'Review already requested');
	}

	// Create
	reviewRequest = new Review({
		reviewerId: data.reviewerId,
		projectId: data.projectId,
		status: 'pending'
	});

	try {
		return await reviewRequest.save();
	} catch (e) {
		throw new UserError(constants.error.UNEXPECTED_ERROR, 'Couldnt save review request');
	}
};

const updateReviewRequest = async (reviewId, data) => {
	return Review.findByIdAndUpdate(
		{_id: reviewId},
		{status: data.status},
		{new: true}
	);
};

const searchReviews = async (data) => {
	let query = {};

	if (data.reviewerId) {
		query.reviewerId = data.reviewerId;
	}

	if (data.status) {
		query.status = data.status;
	}

	return Review.find(query);
};

const getReviewRequest = async(reviewerId, projectId) => {
	return Review.findOne({reviewerId: reviewerId, projectId: projectId});
};

module.exports = {
	createReviewRequest,
	updateReviewRequest,
	getReviewRequest,
	searchReviews
};