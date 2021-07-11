const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const zoneSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
zoneSchema.plugin(toJSON);
zoneSchema.plugin(paginate);

/**
 * @typedef Zone
 */
const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
