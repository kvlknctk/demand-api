const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const sessionSchema = mongoose.Schema(
  {
    sessionNumber: {
      type: String,
      required: true,
      trim: true,
    },
    customerIpAddres: {
      type: String,
    },
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Company',
    },
    barcode: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Barcode',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

/**
 * @typedef Session
 */
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
