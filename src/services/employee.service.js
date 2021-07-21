const httpStatus = require('http-status');
const { User, Employee } = require('../models');
const ApiError = require('../utils/ApiError');
const { v1: uuidv1 } = require('uuid');

/**
 * Create a employee
 * @param {Object} employeeBody
 * @returns {Promise<User>}
 */
const createEmployeeWithForm = async (employeeBody) => {
  const employee = await Employee.create(employeeBody);
  return employee;
};

/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmployees = async (filter, options) => {
  const products = await Employee.paginateRelation(filter, options);
  return products;
};


/**
 * Get employee by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getEmployeeById = async (id) => {
  return Employee.findById(id);
};

const updateEmployeeById = async (employeeId, updateBody) => {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }

  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

const deleteEmployeeById = async (employeeId) => {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }

  await employee.remove();
  return employee;
};

module.exports = {
  getEmployeeById,
  queryEmployees,
  createEmployeeWithForm,
  updateEmployeeById,
  deleteEmployeeById,
};
