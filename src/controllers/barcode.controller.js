const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { barcodeService, categoryService } = require('../services');
const { User } = require('../models');

const getBarcodes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await barcodeService.queryBarcodes({ ...filter, company: req.user.company }, options);
  res.send(result);
});

const getBarcode = catchAsync(async (req, res) => {
  let barcodeId = req.params.barcodeId;
  const result = await barcodeService.getBarcodeById(barcodeId);
  res.send(result);
});

const updateBarcode = catchAsync(async (req, res) => {
  let barcodeId = req.params.barcodeId;
  const barcode = await barcodeService.updateBarcodeById(barcodeId, req.body);
  res.send(barcode);
});

const deleteBarcode = catchAsync(async (req, res) => {
  const product = await barcodeService.deleteBarcodeById(req.params.barcodeId);
  res.send(product);
});

const createBarcode = catchAsync(async (req, res) => {
  console.log('user', req.user);
  const product = await barcodeService.createBarcodeWithForm({ ...req.body, company: req.user.company });
  res.status(httpStatus.CREATED).send(product);
});

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  const createdSession = await barcodeService.createSession(barcode);

  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  res.status(httpStatus.CREATED).send({ barcode, createdSession });
});

const getRequiredDataWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const barcode = await barcodeService.getCompanyFromBarcode(code);
  const categories = await categoryService.getCategoryTreeWithLimitedProduct(barcode.company.id, 4);
  const session = await barcodeService.createSession(barcode);

  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  res.status(httpStatus.CREATED).send({ barcode, categories, session });
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

const requestWaiterFromBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const companyBarcode = await barcodeService.getCompanyFromBarcode(code);
  if (!companyBarcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  // Create new session
  const session = await barcodeService.requestWaiter(companyBarcode);

  res.status(httpStatus.CREATED).send(session);
});

module.exports = {
  getBarcode,
  getBarcodes,
  createBarcode,
  updateBarcode,
  deleteBarcode,
  getCompanyWithBarcode,
  getRequiredDataWithBarcode,
  createSessionFromBarcode,
  requestWaiterFromBarcode,
};
