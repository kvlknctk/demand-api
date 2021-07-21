const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getOrderById = async (id) => {
  return Order.findById(id).populate('user');
};

const updateOrderById = async (productId, updateBody) => {
  const order = await getOrderById(productId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginateRelation(filter, options);
  return orders;
};

const queryOrdersViaSessions = async (sessions) => {
  const orders = await Order.find({}).sort([['createdAt', -1]]);
  return orders;
};

const getOrdersByUserId = async (userId) => {
  const orders = await Order.find({ user: userId });
  return orders;
};

/**
 * Create a order
 * @param {Object} allData
 * @returns {Promise<User>}
 */
const createOrder = async (allData) => {
  console.log(allData);
  const order = await Order.create({
    /*user: allData.user.id,*/
    items: allData.items,
  });

  return order;
};

/**
 * Create a order for Apple
 * @param {Object} data
 * @returns {Promise<User>}
 */
const createOrderApple = async (data) => {
  const order = await Order.create(data);

  return order;
};

/**
 * Create a order for campaign.
 * @param {Object} allData
 * @returns {Promise<User>}
 */
const createOrderCampaign = async (allData) => {
  const order = await Order.create({
    user: allData.userId,
    items: [],
    campaignResponse: {
      campaignCode: allData.campaign.code,
    },
    acoin: allData.campaign.acoin,
    completed: true,
  });

  return order;
};

/**
 * Approve Order
 * @returns {Promise<User>}
 * @param conversationId
 * @param iyzicoResponse
 */
const approveOrder = async (conversationId, iyzicoResponse) => {
  const order = await getOrderById(conversationId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  Object.assign(order, { completed: true, iyzicoResponse });
  await order.save();
  return order;
};

const acknowledgeOrder = async (orderId) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  Object.assign(order, { lastStatus: 'approved' });
  await order.save();
  return order;
};

/*
const updateOrderById = async (productId, updateBody) => {
    const order = await getOrderById(productId);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    Object.assign(order, updateBody);
    await order.save();
    return order;
};
*/

module.exports = {
  getOrderById,
  updateOrderById,
  queryOrders,
  queryOrdersViaSessions,
  createOrder,
  createOrderApple,
  createOrderCampaign,

  acknowledgeOrder,
  approveOrder,
  // Admin detail page.
  getOrdersByUserId,
};
