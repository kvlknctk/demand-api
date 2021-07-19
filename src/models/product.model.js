const mongoose = require('mongoose');
const { toJSON, paginateRelation } = require('./plugins');
const { storage } = require('../config/config');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },

    images: {
      type: Array,
    },
    comments: {
      type: Array,
    },
    /* add unapproved comments.
    comments: {
        type    : Array
    },*/
    salePrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    stockCode: {
      type: String,
    },
    barcodeCode: {
      type: String,
    },
    pictures: {
      type: Array,
    },
    size: {
      type: Array,
    },
    colors: {
      type: Array,
    },
    tags: {
      type: Array,
    },
    variants: {
      type: Array,
      default: [{ color: 'red', images: '/variants/default.jpg' }],
    },
    shortDetails: {
      type: String,
    },
    rating: {
      type: Number,
    },
    description: {
      type: String,
    },
    new: {
      type: Boolean,
    },
    sale: {
      type: Boolean,
    },
    price: {
      type: String,
      default: '1.0',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginateRelation);

productSchema.options.toJSON.transform = function (doc, ret, options) {
  if (doc.image) {
    ret.image = `${storage}upload/${doc.image}`;
  }
  return ret;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
