const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const productController = require('../../controllers/product.controller');
const multer = require('multer');

// upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/images/products/')
    },
    filename   : function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '.jpg')
    }
})

//const upload = multer({ dest : 'upload/'});
const upload = multer({storage: storage});
const router = express.Router();

router
    .route('/')
    .post(auth('createProduct'), productController.createProduct)
    .get(productController.getProducts);

router
    .route('/initialContent')
    .get(productController.initialContent);

router
    .route('/slug/:productSlug')
    .get(productController.getProductBySlug);

router
    .route('/comment/:productId')
    .post(auth('addComment'), productController.addComment);

router
    .route('/:productId')
    .put(productController.updateProduct)
    .patch(productController.updateProduct) // deneme olması gereken kullanı?
    .get(productController.getProduct)
    .delete(productController.deleteProduct);

router.route('/:productId/upload')
    .post(upload.any(), productController.uploadImage);

router.route('/:productId/setFeatureImage/:imageId')
    .get(auth(), productController.setFeatureImage);

router.route('/:productId/deleteImage/:imageId')
    .post(productController.deleteImage);


module.exports = router;
