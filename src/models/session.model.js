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
    zone: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Zone',
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
