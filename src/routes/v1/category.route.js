const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const categoryController = require('../../controllers/category.controller');
const multer = require('multer');

// upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/images/categories/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.jpg');
  },
});

// const upload = multer({ dest : 'upload/'});
const upload = multer({ storage });

const router = express.Router();

router.route('/').post(upload.single('image'), categoryController.createCategory).get(categoryController.getCategories);

router.route('/getCategoryTree').get(categoryController.getCategoryTree);

router.route('/:categorySlug').post(categoryController.getCategoryWithFilters);

router.route('/:categoryId').delete(auth('deleteCategory'), categoryController.deleteCategory);

module.exports = router;
