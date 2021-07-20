const httpStatus = require('http-status');
const { User, Barcode, Session } = require('../models');
const ApiError = require('../utils/ApiError');
const { v1: uuidv1 } = require('uuid');

/**
 * Create a user
 * @param {Object} code
 * @returns {Promise<User>}
 */
const getCompanyFromBarcode = async (code) => {
  /*if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }*/

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
    customerIpAddres: 'askdjhaksdjhaksjdhask',
  });
};

module.exports = {
  createSession,
  getCompanyFromBarcode,
  readedBarcode,
};
