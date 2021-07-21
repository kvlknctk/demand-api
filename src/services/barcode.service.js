const httpStatus = require('http-status');
const { User, Barcode, Session } = require('../models');
const ApiError = require('../utils/ApiError');
const { v1: uuidv1 } = require('uuid');

/**
 * Query for barcodes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBarcodes = async (filter, options) => {
  const barcodes = await Barcode.paginateRelation(filter, options);
  return barcodes;
};

/**
 * Get barcode by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getBarcodeById = async (id) => {
  return Barcode.findById(id);
};

const updateBarcodeById = async (barcodeId, updateBody) => {
  const barcode = await getBarcodeById(barcodeId);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  Object.assign(barcode, updateBody);
  await barcode.save();
  return barcode;
};

const deleteBarcodeById = async (barcodeId) => {
  const barcode = await getBarcodeById(barcodeId);
  if (!barcode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barcode not found');
  }

  await barcode.remove();
  return barcode;
};

/**
 * Create a barcode
 * @param {Object} code
 * @returns {Promise<User>}
 */
const getCompanyFromBarcode = async (code) => {
  return Barcode.findById(code).populate('company');
};

const readedBarcode = async (code) => {
  //return Barcode.findById(code);
  return code;
};

const createSession = async (barcode) => {
  let sessionNumber = uuidv1();
  return Session.create({
    barcode: barcode.id,
    sessionNumber,
    company: barcode.company,
    customerIpAddres: 'askdjdhask',
  });
};

/**
 * Create a barcode
 * @param {Object} barcodeBody
 * @returns {Promise<User>}
 */
const createBarcodeWithForm = async (barcodeBody) => {
  const barcode = await Barcode.create(barcodeBody);
  return barcode;
};

module.exports = {
  queryBarcodes,
  createBarcodeWithForm,
  deleteBarcodeById,
  updateBarcodeById,
  createSession,
  getCompanyFromBarcode,
  readedBarcode,
};
