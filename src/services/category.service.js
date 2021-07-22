const httpStatus = require('http-status');
const { User, Product, Category } = require('../models');
const ApiError = require('../utils/ApiError');
const { domain } = require('../config/config');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Create a category
 * @param {Object} productBody
 * @param file
 * @returns {Promise<User>}
 */
const createCategory = async (productBody, file) => {
  console.log({ productBody });
  const obj = {
    image: file ? file.filename : 'defaultCategory.jpg',
    level: productBody.level,
    ...productBody,
  };
  const category = await Category.create(obj);
  return category;
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

/**
 * Get all categories
 * @returns {Promise<QueryResult>}
 */
const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

/**
 * getCategoryTree
 * @returns {Promise<QueryResult>}
 */

const getCompanyCategoriesTree = async (company) => {
  const categories = await getCategoryTree(company);
  return categories;
};

const getCategoryTree = async (company) => {
  const tree = await Category.aggregate([
    {
      $facet: {
        root: [
          {
            $match: {
              $and: [{ level: 1 }, { company: ObjectId(company) }],
            },
          },
        ],

        children: [
          { $match: { level: 2 } },

          {
            $graphLookup: {
              from: 'Category',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentId',
              maxDepth: 0,
              as: 'hierarchy',
            },
          },
          { $sort: { _id: 1 } },
        ],
        grandchild: [
          { $match: { level: 3 } },
          {
            $graphLookup: {
              from: 'Category',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentId',
              maxDepth: 0,
              as: 'hierarchy',
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
    { $unwind: '$children' },
    {
      $project: {
        root: 1,
        'children.name': 1,
        'children._id': 1,
        'children.level': 1,
        'children.icon': 1,
        'children.color': 1,
        'children.company': 1,
        'children.filters': 1,
        'children.slug': 1,
        'children.rate': 1,
        'children.parentId': 1,
        'children.hierarchy': {
          $filter: {
            input: '$grandchild',
            as: 'sub_level',
            cond: {
              $eq: ['$$sub_level.parentId', '$children._id'],
            },
          },
        },
      },
    },
    { $group: { _id: '$root', children: { $push: '$children' } } },
    { $project: { root: '$_id', children: 1 } },
    { $unwind: '$root' },
    {
      $project: {
        'root._id': 1,
        'root.name': 1,
        'root.slug': 1,
        'root.color': 1,
        'root.company': 1,
        'root.rate': 1,
        'root.filters': 1,
        'root.icon': {
          $concat: [domain, '/upload/categories/', '$root.icon'],
        },
        'root.level': 1,
        'root.hierarchy': {
          $filter: {
            input: '$children',
            as: 'sub_level',
            cond: {
              $eq: ['$$sub_level.parentId', '$root._id'],
            },
          },
        },
      },
    },
    { $replaceRoot: { newRoot: '$root' } },
  ]);

  return tree;
};

const getCategoryTreeWithLimitedProduct = async (company, limit) => {
  const tree = await Category.aggregate([
    {
      $lookup: {
        as: 'products',
        let: { local_id: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$local_id', '$category'] } } },
          { $sort: { createdAt: 1 } },
          { $limit: limit },
        ],
        from: 'products',
      },
    },
    {
      $facet: {
        root: [
          {
            $match: {
              $and: [{ level: 1 }, { company: ObjectId(company) }],
            },
          },
        ],

        children: [
          { $match: { level: 2 } },

          {
            $graphLookup: {
              from: 'Category',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentId',
              maxDepth: 0,
              as: 'hierarchy',
            },
          },
          { $sort: { _id: 1 } },
        ],
        grandchild: [
          { $match: { level: 3 } },
          {
            $graphLookup: {
              from: 'Category',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentId',
              maxDepth: 0,
              as: 'hierarchy',
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
    { $unwind: '$children' },
    {
      $project: {
        root: 1,
        'children.name': 1,
        'children._id': 1,
        'children.level': 1,
        'children.icon': 1,
        'children.color': 1,
        'children.company': 1,
        'children.products': 1,
        'children.filters': 1,
        'children.slug': 1,
        'children.rate': 1,
        'children.parentId': 1,
        'children.hierarchy': {
          $filter: {
            input: '$grandchild',
            as: 'sub_level',
            cond: {
              $eq: ['$$sub_level.parentId', '$children._id'],
            },
          },
        },
      },
    },
    { $group: { _id: '$root', children: { $push: '$children' } } },
    { $project: { root: '$_id', children: 1 } },
    { $unwind: '$root' },
    {
      $project: {
        'root._id': 1,
        'root.name': 1,
        'root.slug': 1,
        'root.color': 1,
        'root.company': 1,
        'root.products': 1,
        'root.rate': 1,
        'root.filters': 1,
        'root.icon': {
          $concat: [domain, '/upload/categories/', '$root.icon'],
        },
        'root.level': 1,
        'root.hierarchy': {
          $filter: {
            input: '$children',
            as: 'sub_level',
            cond: {
              $eq: ['$$sub_level.parentId', '$root._id'],
            },
          },
        },
      },
    },
    { $replaceRoot: { newRoot: '$root' } },
  ]);

  return tree;
};

/**
 * Get category by Slug
 * @param {string} slug
 * @returns {Promise<User>}
 */
const getCategoryBySlug = async (slug) => {
  return Category.findOne({ slug });
};

const deleteCategory = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  const searchSubCategory = await Category.find({ parentId: category.id });
  if (searchSubCategory.length > 0) {
    throw new ApiError(httpStatus.CONFLICT, 'Bu kategoriye ait alt kategoriler bulunmaktadır. Kategoriyi silemezsiniz.');
  }

  await category.remove();
  return category;
};

module.exports = {
  queryCategories,
  createCategory,
  getCategoryBySlug,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getCategoryTree,
  getCompanyCategoriesTree,
  getCategoryTreeWithLimitedProduct,
};
