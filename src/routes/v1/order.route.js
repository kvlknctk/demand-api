const express = require('express');
const auth = require('../../middlewares/auth');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.route('/create').post(orderController.createOrder);

router.route('/getMyOrdersViaMySessions').post(orderController.getMyOrdersViaMySessions);

router.route('/getMyOrders/:orderId').get(auth(), orderController.getOrder);

router.route('/').get(auth('getOrders'), orderController.getOrders);

router.route('/callback').post(orderController.iyziCallback);

router.route('/:orderId').get(orderController.getOrder);

module.exports = router;
