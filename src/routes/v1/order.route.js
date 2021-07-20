const express = require('express');
const auth = require('../../middlewares/auth');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.route('/create').post(orderController.createOrder);

router.route('/getMyOrders').get(auth(), orderController.getMyOrders);

router.route('/getMyOrders/:orderId').get(auth(), orderController.getOrder);

router.route('/').get(auth('getOrders'), orderController.getOrders);

router.route('/callback').post(orderController.iyziCallback);

router
  .route('/:orderId')
  .get(auth('getOrder'), orderController.getOrder)
  .get(auth('updateOrder'), orderController.updateOrder);

module.exports = router;
