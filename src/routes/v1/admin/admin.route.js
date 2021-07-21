const express = require('express');
const auth = require('../../../middlewares/auth');
const authSoft = require('../../../middlewares/authSoft');
const validate = require('../../../middlewares/validate');
const { adminController, productController, employeeController, barcodeController } = require('../../../controllers');
const multer = require('multer');

// upload image
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.png');
  },
});

const productImage = multer({ storage: productStorage });

const router = express.Router();
// router.route('/dashboard').get(auth('getDashboard'), adminController.getDashboard);

router.route('/dashboard').get(auth('getDashboard'), adminController.dashboard);

router.route('/categories').get(auth('getCategories'), adminController.getCategories);
router.route('/categories').post(auth('createCategory'), adminController.createCategory);
router.route('/categories/:categoryId').delete(auth('createCategory'), adminController.deleteCategory);
router.route('/categories/:categoryId').get(auth('getCategory'), adminController.getCategory);
router.route('/categories/:categoryId').post(auth('updateCategory'), adminController.updateCategory);

router.route('/:companyId/orders').get(auth('getOrders'), adminController.getOrders);

router.route('/products').get(auth('getProducts'), adminController.getProducts);
router.route('/products').post(auth('createProduct'), productImage.any(), adminController.createProduct);
router.route('/products/:productId').delete(auth('deleteProduct'), productController.deleteProduct);

router.route('/employees').get(auth('getEmployees'), employeeController.getEmployees);
router.route('/employees').post(auth('createEmployee'), employeeController.createEmployee);
router.route('/employees/:employeId').delete(auth('deleteEmployee'), employeeController.deleteEmployee);

router.route('/barcodes').get(auth('getBarcodes'), barcodeController.getBarcodes);
router.route('/barcodes').post(auth('createBarcode'), barcodeController.createBarcode);
router.route('/barcodes/:barcodeId').delete(auth('deleteBarcode'), barcodeController.deleteBarcode);

router.route('/orders').get(auth('getOrders'), adminController.getOrders);
router.route('/orders/:orderId/approve').get(auth('approveOrder'), adminController.approveOrder);

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
