const httpStatus = require('http-status');
const { Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { domain } = require('../config/config');
const ObjectId = require('mongoose').Types.ObjectId;
const aws = require('aws-sdk');
const s3 = new aws.S3();
const config = require('../config/config');

aws.config.update({
  secretAccessKey: config.aws.secretKeyId,
  accessKeyId: config.aws.accessKeyId,
});

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

  if (company.image) {
    console.log(company.image);
    let params = { Bucket: 'demand-api', Key: company.image };

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // error
      else console.log(); // deleted
    });
  }

  Object.assign(company, image);
  await company.save();
  return company;
};

module.exports = {
  saveCompanySettings,
  saveMasterImageWithCompanyId,
  getCompanyById,
};
