const express = require('express');
const auth = require('../../../middlewares/auth');
const authSoft = require('../../../middlewares/authSoft');
const validate = require('../../../middlewares/validate');
const userValidation = require('../../../validations/user.validation');
const { adminController } = require('../../../controllers');
const multer = require('multer');

// upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/ai/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.jpg');
  },
});

// upload image
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/categories/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.png');
  },
});

//const upload = multer({ dest : 'upload/'});
const upload = multer({ storage: storage });
const categoryImage = multer({ storage: categoryStorage });

const router = express.Router();
// router.route('/dashboard').get(auth('getDashboard'), adminController.getDashboard);

router.route('/dashboard').get(auth('getDashboard'), adminController.dashboard);

router.route('/categories').get(auth('getCategories'), adminController.getCategories);
router.route('/categories').post(auth('createCategory'), categoryImage.any(), adminController.createCategory);
router.route('/categories/:categoryId').delete(auth('createCategory'), adminController.deleteCategory);
router.route('/categories/:categoryId').get(auth('getCategory'), adminController.getCategory);
router.route('/categories/:categoryId').post(auth('updateCategory'), adminController.updateCategory);
router.route('/:companyId/orders').get(auth('getOrders'), adminController.getOrders);
router.route('/products').get(auth('getProducts'), adminController.getProducts);
router.route('/orders').get(auth('getOrders'), adminController.getOrders);
router.route('/orders/:orderId/approve').get(auth('approveOrder'), adminController.approveOrder);

/*
router.route('/adverts').get(auth('getAdverts'), adminController.getAdverts);
router.route('/adverts/:advertId').post(auth('updateAdvert'), adminController.updateAdvert);
router.route('/adverts/:advertId').get(auth('getAdverts'), adminController.getAdvert);
router.route('/adverts/:advertId/upload').post(upload.any(), auth('uploadAdvertImage'), adminController.uploadAdvertImage);

router.route('/users').get(auth('getUsers'), adminController.getUsers);
router.route('/users/:userId').get(auth('getUser'), adminController.getUser);

router.route('/products').get(auth('getProducts'), adminController.getProducts);

router.route('/orders').get(auth('getOrders'), adminController.getOrders);

router.route('/categories').get(auth('getCategories'), adminController.getCategories);
router.route('/categories').post(auth('createCategory'), categoryImage.any(), adminController.createCategory);
router.route('/categories/:categoryId').delete(auth('createCategory'), adminController.deleteCategory);
router.route('/categories/:categoryId').get(auth('getCategory'), adminController.getCategory);
router.route('/categories/:categoryId').post(auth('updateCategory'), adminController.updateCategory);

router.route('/pages').get(auth('getPages'), adminController.getPages);
router.route('/pages').post(auth('createPage'), adminController.createPage);
router.route('/pages/:pageId').delete(auth('deletePage'), adminController.deletePage);

router.route('/campaigns').get(auth('editCampaign'), adminController.listCampaign);
router.route('/campaigns').post(auth('editCampaign'), adminController.createCampaign);
router.route('/campaigns/:campaignId').delete(auth('editCampaign'), adminController.deleteCampaign);

router.route('/installCities').get(adminController.installCities);
*/

module.exports = router;
