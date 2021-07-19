var express = require('express');
const NotificationsController = require('../controllers/NotificationsController');

var router = express.Router();

router.post('/', NotificationsController.sendNotification);

module.exports = router;