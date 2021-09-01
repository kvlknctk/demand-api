const httpStatus = require('http-status');
const { Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { domain } = require('../config/config');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get company by id
 * @param {ObjectId} id
 * @returns {Promise<Company>}
 */
const getCompanyById = async (id) => {
  return Company.findById(id);
};

const saveCompanySettings = async (companyId, newSettings) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  Object.assign(company, { settings: newSettings });
  await company.save();
  return company;
};

const saveMasterImageWithCompanyId = async (companyId, image) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  Object.assign(company, { image });
  await company.save();
  return company;
};

module.exports = {
  saveCompanySettings,
  saveMasterImageWithCompanyId,
  getCompanyById,
};
