const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { initialService } = require('../services');

const install = catchAsync(async (req, res) => {
  await initialService.fakerBarcode();
  res.status(httpStatus.CREATED).send({ done: 'done' });
});

module.exports = {
  install,
};
