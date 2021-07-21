const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { barcodeService } = require('../services');

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;
  console.log(code);

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  // Create new session
  //const session = await barcodeService.createSession(barcode);

  res.status(httpStatus.CREATED).send(barcode);
});

const createSessionFromBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  // Create new session
  const session = await barcodeService.createSession(barcode);

  res.status(httpStatus.CREATED).send(session);
});

module.exports = {
  getCompanyWithBarcode,
  createSessionFromBarcode,
};
