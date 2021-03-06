const express = require('express');

const barcodeController = require('../../controllers/barcode.controller');

const router = express.Router();

router.route('/:code').get(barcodeController.getCompanyWithBarcode);
router.route('/:code/createSession').get(barcodeController.createSessionFromBarcode);
router.route('/:code/requiredData').get(barcodeController.getRequiredDataWithBarcode);
router.route('/:code/requestWaiter').get(barcodeController.requestWaiterFromBarcode);

module.exports = router;
