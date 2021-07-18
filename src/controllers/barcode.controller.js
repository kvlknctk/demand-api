const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { initialService, barcodeService } = require('../services');

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Zone not found');
  }
  console.log({ barcode });
  /* const code = await initialService.fakerBarcode(); */
  res.status(httpStatus.CREATED).send(barcode);
});

module.exports = {
  getCompanyWithBarcode,
};
