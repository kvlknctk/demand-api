const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const getDashboard = catchAsync(async (req, res) => {
  const widgets = await adminService.allWidgetsData();

  res.status(httpStatus.CREATED).send({ widgets });
});

module.exports = {
  getDashboard,
};
