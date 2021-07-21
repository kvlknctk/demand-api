const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { barcodeService } = require('../services');

const getBarcodes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await barcodeService.queryBarcodes(filter, options);
  res.send(result);
});

const updateBarcode = catchAsync(async (req, res) => {
  const barcode = await barcodeService.updateBarcodeById(req.params.barcodeId, req.body);
  res.send(barcode);
});

const deleteBarcode = catchAsync(async (req, res) => {
  const product = await barcodeService.deleteBarcodeById(req.params.barcodeId);
  res.send(product);
});

const createBarcode = catchAsync(async (req, res) => {
  const product = await barcodeService.createBarcodeWithForm(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

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
  getBarcodes,
  createBarcode,
  updateBarcode,
  deleteBarcode,
  getCompanyWithBarcode,
  createSessionFromBarcode,
};
