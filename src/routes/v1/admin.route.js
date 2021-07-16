const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.route('/dashboard').get(auth('getDashboard'), adminController.getDashboard);

module.exports = router;
