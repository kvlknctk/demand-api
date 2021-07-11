const express = require('express');

const barcodeController = require('../../controllers/barcode.controller');

const router = express.Router();

router.route('/:code').get(barcodeController.getCompanyWithBarcode);

module.exports = router;
