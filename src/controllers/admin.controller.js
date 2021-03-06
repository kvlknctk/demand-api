const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  pushService,
  adminService,
  userService,
  productService,
  orderService,
  categoryService,
  companyService,
} = require('../services');
const { Order, User, Bought } = require('./../models');
const auth = require('../middlewares/auth');
const s3Storage = require('multer-sharp-s3');

const path = require('path');

const dashboard = catchAsync(async (req, res) => {
  const orders = await Order.find({}).sort([['createdAt', -1]]);
  //const priceTotal = lazySumOrder(moneyCount);

  res.send({ orders });
});

/*const getAdverts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await advertService.queryAdvertsForAdmin({ ...filter }, options);
  res.send(result);
});

const getAdvert = catchAsync(async (req, res) => {
  const result = await adminService.getAdvertById(req.params.advertId);
  console.log({ result });
  res.send(result);
});

const updateAdvert = catchAsync(async (req, res) => {
  const selectedFields = pick(req.body.editedAdvert, ['slug', 'acoin', 'approved', 'title', 'body', 'priceMin', 'priceMax']);
  const result = await adminService.updateAdvertById(req.params.advertId, selectedFields);
  res.send(result);
});*/

/*
const uploadAdvertImage = catchAsync(async (req, res) => {
  try {
    const photos = req.files;

    if (!photos) {
      res.status(400).send({
        status: false,
        data: 'Resim seçilmedi.',
      });
    } else {
      for (let po in photos) {
        // Generate Big Image
        /!*await sharp(photos[po].path)
          .resize({ width: 640, height: 480 })
          .jpeg({ quality: 70 })
          .toFile(`${photos[po].destination}/resized/${photos[po].filename}`);*!/
        /!*await advertService.addImage(req.params.advertId, photos[po].filename);*!/
      }

      // send response
      res.send({ product: 'OK' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
*/

const createProduct = catchAsync(async (req, res) => {
  try {
    const files = req.files;

    let cretedProduct;
    if (files[0]) {
      // Create product with image file name.
      cretedProduct = await productService.createProduct({
        ...req.body,
        image: files[0].middle.key,
        company: req.user.company,
      });
    } else {
      cretedProduct = await productService.createProduct({ ...req.body, company: req.user.company });
    }

    // We need to create thumbnail image for fast views.
    /*await sharp(files[0].path)
      .resize({ width: 640, height: 480 })
      .jpeg({ quality: 95 })
      .toFile(`${files[0].destination}/resized/${files[0].filename}`);*/

    // Return a The created product
    res.send({ product: cretedProduct });
  } catch (err) {
    res.status(500).send(err);
  }
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  const orders = await orderService.getOrdersByUserId(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ user, orders });
});

const getProductDetail = catchAsync(async (req, res) => {
  let productId = req.params.productId;

  const product = await productService.getProductById(productId);

  res.send({ product });
});

const updateProductDetail = catchAsync(async (req, res) => {
  let productId = req.params.productId;

  const files = req.files;
  console.log('fie', files);

  let product;
  if (files[0]) {
    /*  await sharp(files[0].path)
      .resize({ width: 640, height: 480 })
      .jpeg({ quality: 95 })
      .toFile(`${files[0].destination}/resized/${files[0].filename}`);*/

    product = await productService.updateProductById(productId, {
      ...req.body,
      category: req.body.category,
      image: files[0].middle.key,
    });
  } else {
    product = await productService.updateProductById(productId, { ...req.body, category: req.body.category });
  }

  res.send({ product });
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts({ ...filter, company: req.user.company }, options);
  res.send(result);
});

const createCategory = catchAsync(async (req, res) => {
  const getCategoryLevel = await categoryService.getCategoryById(req.body.parentCategoryId);

  const newCategory = await categoryService.createCategory({
    name: req.body.name,
    slug: req.body.slug,
    body: req.body.body,
    parentId: req.body.categoryType === 'child' ? req.body.parentCategoryId : '5a934e000102030405000000',
    level: req.body.categoryType === 'child' ? getCategoryLevel.level + 1 : 1,
    icon: req.files[0].filename,
  });

  const latestCategories = await categoryService.getCategoryTree();
  res.send(latestCategories);
});

const deleteCategory = catchAsync(async (req, res) => {
  const categoryDelete = await categoryService.deleteCategory(req.params.categoryId);

  const latestCategories = await categoryService.getCategoryTree();
  res.send(latestCategories);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const approveOrder = catchAsync(async (req, res) => {
  /*const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);*/
  const order = await orderService.acknowledgeOrder(req.params.orderId);
  await pushService.pusher.trigger(order.id, 'orderChanged', { order });
  res.send(order);
});

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryTree('60f8974b69f33674268a83d9');
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await adminService.getCategoryById(req.params.categoryId);

  res.send({ category });
});

const updateCategory = catchAsync(async (req, res) => {
  const selectedFields = pick(req.body.editedCategory, ['filters', 'parentId', 'level', 'name', 'color', 'body', 'rate']);
  const category = await adminService.updateCategoryById(req.params.categoryId, selectedFields);

  res.send({ category });
});

const getBarcodeCategory = catchAsync(async (req, res) => {
  /* const category = await adminService.getCategoryById(req.params.categoryId); */

  res.send({ category: 'asd' });
});

const saveSettings = catchAsync(async (req, res) => {
  let companyId = req.user.company;

  const updated = await companyService.saveCompanySettings(companyId, req.body);

  res.send({ company: updated });
});

const saveMasterImage = catchAsync(async (req, res) => {
  let companyId = req.user.company;
  const files = req.files;

  let product;

  if (files[0]) {
    /*  await sharp(files[0].path)
      .resize({ width: 640, height: 480 })
      .jpeg({ quality: 95 })
      .toFile(`${files[0].destination}/resized/${files[0].filename}`);*/
    product = await companyService.saveMasterImageWithCompanyId(companyId, {
      image: files[0].thumb.key,
    });
  } else {
    //product = await productService.updateProductById(productId, { ...req.body, category: req.body.category });
  }
  res.send({ company: product });
});

const getSettings = catchAsync(async (req, res) => {
  let companyId = req.user.company;

  const company = await companyService.getCompanyById(companyId);

  res.send({ company });
});

module.exports = {
  dashboard,
  /*getAdverts,
  getAdvert,
  updateAdvert,
  uploadAdvertImage,*/
  getUsers,
  getUser,
  createProduct,

  updateProductDetail,
  getProductDetail,
  getProducts,

  getOrders,
  approveOrder,

  // Categorie
  getCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,

  // Barcodes
  getBarcodeCategory,

  // Settings
  saveSettings,
  getSettings,
  saveMasterImage,
};
