const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { barcodeService } = require('../services');

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Zone not found');
  }

  res.status(httpStatus.CREATED).send(barcode);
});

module.exports = {
  getCompanyWithBarcode,
};
