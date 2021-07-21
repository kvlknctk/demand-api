const httpStatus = require('http-status');
const { Barcode, Company } = require('../models');

/**
 * Faker barcode
 * @returns {Promise<User>}
 */
const fakerBarcode = async () => {
  return Barcode.create({
    name: 'Desk',
  });
};

const createCompnay = async () => {
  return Company.create({
    name: 'Desk',
    address: 'asd',
    phone: 'asd',
    founders: ['60f59996c08237e0cf16e1c9', '60f59996c08237e0cf16e1c9'],
  });
};

const getCompany = async () => {
  return Company.find({}).populate('founders');
};

module.exports = {
  fakerBarcode,

  createCompnay,
  getCompany,
};
