const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { employeeService } = require('../services');

const getEmployees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await employeeService.queryEmployees(filter, options);
  res.send(result);
});

const updateEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.updateEmployeeById(req.params.employeeId, req.body);
  res.send(employee);
});

const deleteEmployee = catchAsync(async (req, res) => {
  const product = await employeeService.deleteProductById(req.params.employeeId);
  res.send(product);
});

const createEmployee = catchAsync(async (req, res) => {
  const product = await employeeService.createEmployeeWithForm(req.body);
  res.status(httpStatus.CREATED).send(product);
});

module.exports = {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  createEmployee,
};
