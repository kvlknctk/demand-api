const httpStatus = require('http-status');
const { User, Barcode } = require('../models');
const ApiError = require('../utils/ApiError');

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

module.exports = {
  getCompanyFromBarcode,
  readedBarcode,
};
