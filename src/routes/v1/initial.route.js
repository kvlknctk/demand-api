const express = require('express');

const initialController = require('../../controllers/initial.controller');

const router = express.Router();

router.route('/install').get(initialController.install);
router.route('/createCompany').get(initialController.createCompany);
router.route('/getCompany').get(initialController.getCompany);

module.exports = router;
