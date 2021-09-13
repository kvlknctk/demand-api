const express = require('express');
const auth = require('../../../middlewares/auth');
const { staffController } = require('../../../controllers');

const router = express.Router();

router.route('/dashboard').get(auth('getStaffDashboard'), staffController.dashboard);

module.exports = router;
