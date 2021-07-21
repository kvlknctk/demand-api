const mongoose = require('mongoose');
const { toJSON, paginateRelation } = require('./plugins');
const { storage } = require('../config/config');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    images: {
      type: Array,
    },

    price: {
      type: String,
      default: '1.0',
      required: true,
    },
    discount: {
      type: Number,
    },
    pictures: {
      type: Array,
    },
    size: {
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

    body: {
      type: String,
    },

    saleActive: {
      type: Boolean,
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
