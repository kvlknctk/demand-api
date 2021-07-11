const httpStatus = require('http-status');
const { Barcode } = require('../models');

/**
 * Faker barcode
 * @returns {Promise<User>}
 */
const fakerBarcode = async () => {
  return Barcode.create({
    name: 'Desk',
  });
};

module.exports = {
  fakerBarcode,
};
