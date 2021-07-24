const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * All Widgets Data
 * @returns {Promise<User>}
 */
const allWidgetsData = async () => {
  return { falan: 'volkan' };
};

module.exports = {
  allWidgetsData,
};
