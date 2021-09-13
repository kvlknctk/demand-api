const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  pushService,
  adminService,
  userService,
  productService,
  orderService,
  categoryService,
  companyService,
} = require('../services');
const { Order, User, Bought } = require('./../models');

const dashboard = catchAsync(async (req, res) => {
  const orders = await Order.find({}).sort([['createdAt', -1]]);
  res.send({ orders });
});

module.exports = {
  dashboard,
};
