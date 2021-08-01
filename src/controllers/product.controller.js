const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, categoryService, pageService } = require('../services');
const { Product } = require('../models');
const fs = require('file-system');
/*const sharp = require('sharp');*/
const path = require('path');

const initialContent = catchAsync(async (req, res) => {
  const products = await productService.getInitialProducts();

  const seasonProducts = await productService.getInitialProducts();
  const newProducts = await productService.getInitialProducts();
  const getPages = await pageService.getAllPages();

  const categories = await categoryService.getCategoryTree();
  const companyData = {
    name: 'Demand',
    duns: 'Codenra Ltd.',
    phone: '02125990220',
    gsm: '05547997414',
    address: 'Kadıköy / İstanbul',
    email: 'info@codenra.co.uk',
    body: 'Zone Order',
    social: [
      { provider: 'instagram', link: 'http://codenra.co.uk', icon: 'instagram' },
      { provider: 'twitter', link: 'http://codenra.co.uk', icon: 'twitter' },
      { provider: 'facebook', link: 'http://codenra.co.uk', icon: 'facebook' },
    ],
  };

  const transform = {
    products,

    seasonProducts,
    newProducts,

    categories,

    getPages,

    companyData,
  };

  res.status(httpStatus.CREATED).send(transform);
});

const createProduct = catchAsync(async (req, res) => {
  console.log({ req });
  console.log({ body: req.body });
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const products = await productService.queryProducts(filter, options);
  res.send({ products });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found on db ');
  }
  res.send({ product });
});

const getProductBySlug = catchAsync(async (req, res) => {
  const findedProduct = await Product.findOne({ slug: req.params.productSlug });
  const product = await productService.getProductById(findedProduct.id);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found on DB! ');
  }

  res.send({ product });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const addComment = catchAsync(async (req, res) => {
  const product = await productService.addCommentToProduct(req.params.productId, req);
  res.send({ product });
});

const setFeatureImage = catchAsync(async (req, res) => {
  const product = await productService.setFeatureImage(req.params.productId, req.params.imageId);
  res.send({ product });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.deleteProductById(req.params.productId);
  res.send(product);
});

const uploadImage = catchAsync(async (req, res) => {
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
        /* await sharp(photos[po].path)
          .resize({ width: 260, height: 345 })
          .jpeg({ quality: 80 })
          .toFile(`${photos[po].destination}/aresized/${photos[po].filename}`);

        // Generate Thumb Image
        await sharp(photos[po].path)
          .resize({ width: 70, height: 100 })
          .jpeg({ quality: 80 })
          .toFile(`${photos[po].destination}/athumb/${photos[po].filename}`);*/

        await productService.addImage(req.params.productId, photos[po].filename);
      }
      const product = await productService.getProductById(req.params.productId);

      // send response
      res.send({ product });
    }
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
});

const deleteImage = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const findImage = product.images.find((item) => item.id == req.params.imageId);
  const imageDiscard = product.images.filter((item) => item.id != req.params.imageId);

  fs.fs.unlink(`upload/images/products/${findImage.file}`, (err) => {
    //if (err) throw err;
  });
  fs.fs.unlink(`upload/images/products/athumb/${findImage.file}`, (err) => {
    //if (err) throw err;
  });
  fs.fs.unlink(`upload/images/products/aresized/${findImage.file}`, (err) => {
    //if (err) throw err;
  });

  Object.assign(product, { images: imageDiscard });
  await product.save();

  res.status(httpStatus.ACCEPTED).send({ product });
});

module.exports = {
  initialContent,

  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  uploadImage,
  deleteImage,

  //getProductBySlug
  getProductBySlug,
  addComment,

  // Product manipulate
  setFeatureImage,
};
