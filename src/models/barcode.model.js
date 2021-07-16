const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const barcodeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
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
barcodeSchema.plugin(toJSON);
barcodeSchema.plugin(paginate);

/**
 * @typedef Barcode
 */
const Barcode = mongoose.model('Barcode', barcodeSchema);

module.exports = Barcode;
