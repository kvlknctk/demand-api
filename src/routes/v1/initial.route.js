const express = require('express');

const initialController = require('../../controllers/initial.controller');

const router = express.Router();

router.route('/install').get(initialController.install);

module.exports = router;
