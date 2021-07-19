const httpStatus = require('http-status');
const {User, Product} = require('../models');
const ApiError = require('../utils/ApiError');
const { v1: uuidv1 } = require('uuid');

/**
 * get  a getInitialProducts
 * @returns {Promise<User>}
 */
const getInitialProducts = async () => {
    const initial = await Product.find().populate('category');
    return initial;
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<User>}
 */
const createProduct = async (productBody) => {

    if (await Product.uniqueSlugControl(productBody.slug)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bu isim daha daha önceden kullanılmıştır. İsim yanına varyasyon ekleyerek devam edebilirsiniz.');
    }

    const product = await Product.create(productBody);
    return product;
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
    const products = await Product.paginateRelation(filter, options);
    return products;
};

const queryProducts2 = async (category) => {
    const products = await Product.find({category: category})
    return products;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
    return Product.findById(id).populate('category');
};

const getProductBySlug = async (slug) => {
    return Product.findOne({slug});
};

const updateProductById = async (productId, updateBody) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    Object.assign(product, updateBody);
    await product.save();
    return product;
};

const addCommentToProduct = async (productSlug, request) => {
    console.log({productSlug})
    const product = await getProductBySlug(productSlug);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    console.log('body', request.body.comment)

    const newComment = {
        ...request.body.comment,
        userName : request.user.name,
        createdAt: new Date(),
        active   : 0
    }

    let comments = product.comments.concat(newComment);
    console.log({comments})
    Object.assign(product, {comments});
    await product.save();
    return product;
};

const deleteProductById = async (productId) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    await product.remove();
    return product;
};

const addImage = async (productId, file) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    Object.assign(product, {
        images: [...product.images, {
            id  : uuidv1(),
            file,
            featured : false
        }]
    });
    await product.save();
    return product;
};


const setFeatureImage = async (productId, imageId) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    console.log("manip")

    /* Object.assign(product, {
         images: [...product.images, {
             id  : uuidv1(),
             file,
             featured : false
         }]
     });*/
    await product.save();
    return product;
};


module.exports = {
    getInitialProducts,

    queryProducts,
    createProduct,
    updateProductById,
    deleteProductById,
    queryProducts2,
    getProductById,
    addImage,
    addCommentToProduct,
    getProductBySlug,
    setFeatureImage
};
