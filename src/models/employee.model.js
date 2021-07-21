const mongoose = require('mongoose');

const { toJSON, paginate, paginateRelation } = require('./plugins');

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);
employeeSchema.plugin(paginateRelation);

/**
 * @typedef Employee
 */
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
