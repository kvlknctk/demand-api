const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { domain } = require('../config/config');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      index: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    rate: {
      type: Number,
      default: 0,
    },
    body: {
      type: String,
    },
    filters: {
      type: Array,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Category',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Company',
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

/* ainitial
*
* {
  "_id": ObjectId("5a934e000102030405000000"),
  "name": "root",
  "slug": "root",
  "level": 0
}
*
*  */

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

categorySchema.options.toJSON.transform = function (doc, ret, options) {
  ret.icon = `${domain}/upload/categories/${doc.icon}`;
  return ret;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
