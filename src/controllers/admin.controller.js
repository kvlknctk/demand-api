const httpStatus = require('http-status');
const pick = require('../utils/pick');
/*const { lazySumOrder } = require('../utils/lazySum');*/
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService, userService, productService, orderService, categoryService } = require('../services');
const auth = require('../middlewares/auth');
const fs = require('file-system');
const sharp = require('sharp');
const path = require('path');
const { Order, User, Bought } = require('./../models');

const dashboard = catchAsync(async (req, res) => {
  const orders = await Order.find({}).sort([['createdAt', -1]]);
  //const priceTotal = lazySumOrder(moneyCount);

  res.send({ orders });
});

const getAdverts = catchAsync(async (req, res) => {
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
});

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
        await sharp(photos[po].path)
          .resize({ width: 640, height: 480 })
          .jpeg({ quality: 70 })
          .toFile(`${photos[po].destination}/resized/${photos[po].filename}`);

        await advertService.addImage(req.params.advertId, photos[po].filename);
      }

      // send response
      res.send({ product: 'OK' });
    }
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
});

const createProduct = catchAsync(async (req, res) => {
  try {
    const files = req.files;

    // Create product with image file name.
    const cretedProduct = await productService.createProduct({ ...req.body, image: files[0].filename });

    // We need to create thumbnail image for fast views.
    await sharp(files[0].path)
      .resize({ width: 640, height: 480 })
      .jpeg({ quality: 95 })
      .toFile(`${files[0].destination}/resized/${files[0].filename}`);

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
  const adverts = await advertService.getAdvertsByUserId(req.params.userId);
  const boughts = await boughtService.getUserBoughtsByUserId(req.params.userId);
  const otps = await otpService.getOtpByUser(req.params.userId);
  const provider = await providerService.getProviderByUserId(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ user, orders, adverts, boughts, otps, provider });
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
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
  const result = await orderService.acknowledgeOrder(req.params.orderId);
  res.send(result);
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

const getPages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await pageService.queryPages(filter, options);
  res.send(result);
});

const deletePage = catchAsync(async (req, res) => {
  const page = await pageService.deletePage(req.params.pageId);
  res.status(httpStatus.OK).send('ok');
});

const createPage = catchAsync(async (req, res) => {
  const page = await campaignService.createCampaign(req.body);
  res.status(httpStatus.CREATED).send(page);
});

/*
const install = catchAsync(async (req, res) => {
  const page = await adminService.installService();
  res.status(httpStatus.CREATED).send({ page: 'asd' });
});
*/

const listCampaign = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await campaignService.listCampaign(filter, options);
  res.send(result);
});

const createCampaign = catchAsync(async (req, res) => {
  const page = await campaignService.createCampaign(req.body);
  res.status(httpStatus.CREATED).send(page);
});

const deleteCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.deleteCampaign(req.params.campaignId);
  res.status(httpStatus.OK).send('ok');
});
const installCities = catchAsync(async (req, res) => {
  const campaign = await locationService.installCities();
  res.status(httpStatus.OK).send('ok');
});

module.exports = {
  dashboard,
  getAdverts,
  getAdvert,
  updateAdvert,
  uploadAdvertImage,
  getUsers,
  getUser,
  getProducts,
  createProduct,

  getOrders,
  approveOrder,

  // PAGE
  getPages,

  // Categorie
  getCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,

  createPage,
  deletePage,

  // Campaign
  listCampaign,
  createCampaign,
  deleteCampaign,

  // Tools Services
  installCities,
};
