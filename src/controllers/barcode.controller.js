const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { initialService } = require('../services');

const getCompanyWithBarcode = catchAsync(async (req, res) => {
  const { code } = req.params;
  console.log({ code });
  /* const code = await initialService.fakerBarcode(); */
  res.status(httpStatus.CREATED).send(code);
});

module.exports = {
  getCompanyWithBarcode,
};
