const express = require('express');
const auth = require('../../../middlewares/auth');
const config = require('../../../config/config');
const authSoft = require('../../../middlewares/authSoft');
const validate = require('../../../middlewares/validate');
const { adminController, productController, employeeController, barcodeController } = require('../../../controllers');
const multer = require('multer');
const aws = require('aws-sdk');
const crypto = require('crypto');
/*const multerS3 = require('multer-s3');*/
const s3Storage = require('multer-sharp-s3');

// upload image

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: config.aws.secretKeyId,
  accessKeyId: config.aws.accessKeyId,
});

const productStorageLocal = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.png');
  },
});

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/categories/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.png');
  },
});

const productStorage = s3Storage({
  Key: (req, file, cb) => {
    console.log('user', req.user);
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(err, err ? undefined : 'products/' + raw.toString('hex'));
    });
  },
  s3,
  Bucket: 'demand-api',
  multiple: true,
  resize: [
    { suffix: 'thumb', width: 480, height: 300 },
    { suffix: 'middle', width: 640, height: 480 },
  ],
});

const storageSettings = s3Storage({
  Key: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(err, err ? undefined : 'settings/' + raw.toString('hex'));
    });
  },
  s3,
  Bucket: 'demand-api',
  multiple: true,
  resize: [{ suffix: 'thumb', width: 640, height: 480 }],
});

const productImage = multer({ storage: productStorage });
const settingsImage = multer({ storage: storageSettings });

const router = express.Router();

router.route('/dashboard').get(auth('getDashboard'), adminController.dashboard);

router.route('/categories').get(auth('getCategories'), adminController.getCategories);
router.route('/categories').post(auth('createCategory') /*categoryImage.any()*/, adminController.createCategory);
router.route('/categories/:categoryId').delete(auth('createCategory'), adminController.deleteCategory);
router.route('/categories/:categoryId').get(auth('getCategory'), adminController.getCategory);
router.route('/categories/:categoryId').post(auth('updateCategory'), adminController.updateCategory);

router.route('/:companyId/orders').get(auth('getOrders'), adminController.getOrders);

router.route('/products').get(auth('getProducts'), adminController.getProducts);
router.route('/products').post(auth('createProduct'), productImage.any(), adminController.createProduct);
router.route('/products/:productId').get(auth('getProductDetail'), adminController.getProductDetail);
router.route('/products/:productId').put(auth('putProductDetail'), productImage.any(), adminController.updateProductDetail);
router.route('/products/:productId').delete(auth('deleteProduct'), productController.deleteProduct);

router.route('/employees').get(auth('getEmployees'), employeeController.getEmployees);
router.route('/employees').post(auth('createEmployee'), employeeController.createEmployee);
router.route('/employees/:employeeId').delete(auth('deleteEmployee'), employeeController.deleteEmployee);

router.route('/barcodes/category').get(auth('getBarcodeCategory'), adminController.getBarcodeCategory);
router.route('/barcodes/:barcodeId').get(auth('getBarcode'), barcodeController.getBarcode);
router.route('/barcodes/:barcodeId').delete(auth('deleteBarcode'), barcodeController.deleteBarcode);
router.route('/barcodes').get(auth('getBarcodes'), barcodeController.getBarcodes);
router.route('/barcodes').post(auth('createBarcode'), barcodeController.createBarcode);

router.route('/orders').get(auth('getOrders'), adminController.getOrders);
router.route('/orders/:orderId/approve').get(auth('approveOrder'), adminController.approveOrder);

router.route('/settings').get(auth('getSettings'), adminController.getSettings);
router.route('/settings').post(auth('saveSettings'), adminController.saveSettings);
router.route('/settings/saveMasterImage').post(auth('saveSettings'), settingsImage.any(), adminController.saveMasterImage);

/*

router.route('/users').get(auth('getUsers'), adminController.getUsers);
router.route('/users/:userId').get(auth('getUser'), adminController.getUser);

router.route('/products').get(auth('getProducts'), adminController.getProducts);

router.route('/pages').get(auth('getPages'), adminController.getPages);
router.route('/pages').post(auth('createPage'), adminController.createPage);
router.route('/pages/:pageId').delete(auth('deletePage'), adminController.deletePage);

router.route('/campaigns').get(auth('editCampaign'), adminController.listCampaign);
router.route('/campaigns').post(auth('editCampaign'), adminController.createCampaign);
router.route('/campaigns/:campaignId').delete(auth('editCampaign'), adminController.deleteCampaign);

router.route('/installCities').get(adminController.installCities);
*/

module.exports = router;
