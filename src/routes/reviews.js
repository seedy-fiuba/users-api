var express = require('express');
const ReviewController = require('../controllers/ReviewController');

var router = express.Router();

router.post('/', ReviewController.createReviewRequest);
router.delete('/', ReviewController.deleteReviewRequest);

module.exports = router;