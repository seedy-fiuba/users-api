let ReviewService = require('../services/ReviewService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');

const { reviewValidator } = require('../validation');

exports.createReviewRequest = async (req, res) => {
    // Validate body
    const {error} = await reviewValidator(req.body);

    // throw validation errors
    if (error) {
        throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
    }

    // Create review request
    const reviewData = await ReviewService.createReviewRequest(req.body);
    return responses.createdOk(res, reviewData);
};

exports.deleteReviewRequest = async (req, res) => {
    // reviewerId y projectId deberia venir en query params -> validate

    // Borrar review request

    return responses.noContent(res);
}