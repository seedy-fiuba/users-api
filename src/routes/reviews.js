var express = require('express');
const ReviewController = require('../controllers/ReviewController');

var router = express.Router();

router.post('/', ReviewController.createReviewRequest);
router.put('/:id', ReviewController.updateReviewRequest);

module.exports = router;