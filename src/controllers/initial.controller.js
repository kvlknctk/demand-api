const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { initialService } = require('../services');

const install = catchAsync(async (req, res) => {
  await initialService.fakerBarcode();
  res.status(httpStatus.CREATED).send({ done: 'done' });
});

const createCompany = catchAsync(async (req, res) => {
  await initialService.createCompnay();
  res.status(httpStatus.CREATED).send({ done: 'done' });
});

const getCompany = catchAsync(async (req, res) => {
  let newVar = await initialService.getCompany();
  res.status(httpStatus.CREATED).send({ done: newVar });
});

module.exports = {
  install,
  createCompany,
  getCompany,
};
