const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastStatus: {
      type: String,
      enum: ['new', 'approved', 'waited', 'arrived', 'cancelled'],
      default: 'new',
    },
    items: {
      type: Array,
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
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
