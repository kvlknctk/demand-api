const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.body, req.file);
  res.status(httpStatus.CREATED).send(result);
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await categoryService.queryCategories(filter, options);
  res.send(result);
});

const getCategoryTree = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryTree();
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  let slug = req.params.categorySlug;
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);

  const category = await categoryService.getCategoryBySlug(slug);
  const adverts = await advertService.queryAdverts({ category }, options);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kategori bulunamad─▒.');
  }
  res.send({ category, adverts });
});

const getCategoryById = catchAsync(async (req, res) => {
  let categoryId = req.params.categoryId;
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);

  const category = await categoryService.getCategoryById(categoryId);
  const products = await productService.getProductsByCategoryId(categoryId);
  console.log({ category, products });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');
  }
  res.send({ category, products });
});

const getCategoryWithFilters = catchAsync(async (req, res) => {
  let slug = req.params.categorySlug;
  let filters = req.body.filters;
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);

  const category = await categoryService.getCategoryBySlug(slug);
  const adverts = await advertService.queryAdvertsWithFilters({ category, filters }, options);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kategori bulunamad─▒.');
  }
  res.send({ category, adverts });
});

const deleteCategory = catchAsync(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kategori bulunamad─▒.');
  }

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  getCategoryById,
  deleteCategory,
  getCategoryTree,
  getCategoryWithFilters,
};
