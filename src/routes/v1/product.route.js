const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const productController = require('../../controllers/product.controller');

//const upload = multer({ dest : 'upload/'});
const router = express.Router();

router.route('/').post(auth('createProduct'), productController.createProduct).get(productController.getProducts);

router.route('/initialContent').get(productController.initialContent);

router.route('/slug/:productSlug').get(productController.getProductBySlug);

router.route('/comment/:productId').post(auth('addComment'), productController.addComment);

router
  .route('/:productId')
  .put(productController.updateProduct)
  .patch(productController.updateProduct) // deneme olması gereken kullanı?
  .get(productController.getProduct)
  .delete(productController.deleteProduct);

router.route('/:productId/setFeatureImage/:imageId').get(auth(), productController.setFeatureImage);

router.route('/:productId/deleteImage/:imageId').post(productController.deleteImage);

module.exports = router;
