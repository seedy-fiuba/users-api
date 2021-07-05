let ReviewService = require('../services/ReviewService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');

const { reviewValidator, searchReviewValidator } = require('../validation');

const VALID_STATUSES = ['pending','approved','rejected'];

exports.createReviewRequest = async (req, res, next) => {
	try {
		// Validate body
		const {error} = await reviewValidator(req.body);

		// throw validation errors
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		// Create review request
		const reviewData = await ReviewService.createReviewRequest(req.body);
		return responses.createdOk(res, reviewData);
	} catch (e) {
		next(e);
	}
};

exports.updateReviewRequest = async (req, res, next) => {
	try {
		let reviewId = req.params.id;
		let payload = req.body;

		if (payload['status'] && !VALID_STATUSES.includes(payload['status'])) {
			throw new UserError(constants.error.BAD_REQUEST, 'Status is invalid. Valid statuses are: ' + VALID_STATUSES);
		}

		if (!payload['status']) {
			throw new UserError(constants.error.BAD_REQUEST, 'Status field is required');
		}

		const reviewData = await ReviewService.updateReviewRequest(reviewId, req.body);

		if (!reviewData) {
			throw new UserError(constants.error.NOT_FOUND, 'Review not found');
		}

		return responses.statusOk(res, reviewData);
	} catch (e) {
		next(e);
	}
};

exports.searchReviews = async(req, res, next) => {
	try {
		let {value, error} = await searchReviewValidator(req.query);
		if (error) {
			throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
		}

		let response = await ReviewService.searchReviews(value);
		return responses.statusOk(res, {
			size: response.length,
			results: response
		});
	} catch (e) {
		next(e);
	}
};