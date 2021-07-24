const mongoose = require('mongoose');

const { toJSON, paginate, paginateRelation } = require('./plugins');

const barcodeSchema = mongoose.Schema(
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
barcodeSchema.plugin(toJSON);
barcodeSchema.plugin(paginate);
barcodeSchema.plugin(paginateRelation);

/**
 * @typedef Barcode
 */
const Barcode = mongoose.model('Barcode', barcodeSchema);

module.exports = Barcode;
