const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService, cashierService, productService, pushService } = require('../services');
//const { start3DPayment, complete3DPayment } = require('../utils/iyzico');
const pick = require('../utils/pick');
const Pusher = require('pusher');
const config = require('../config/config');

const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  useTLS: true,
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found on db ');
  }
  res.send({ order });
});

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder({
    items: req.body.items,
    sessions: req.body.sessions,
    lastReadedBarcodeOfCompany: req.body.lastReadedBarcodeOfCompany,
  });

  await pushService.pusher.trigger(req.body.lastReadedBarcodeOfCompany, 'orderCompleted', { order });

  res.status(httpStatus.CREATED).send({ order });
});

const getMyOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await orderService.queryOrders(filter, options);
  res.send({ orders: result });
});

const getMyOrdersViaMySessions = catchAsync(async (req, res) => {
  const result = await orderService.queryOrdersViaSessions(req.body.sessions);
  console.log({ result });
  res.send({ orders: result });
});

const updateOrder = catchAsync(async (req, res) => {
  const product = await orderService.updateOrderById(req.params.orderId, req.body);
  res.send(product);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'relation']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const createPayment = catchAsync(async (req, res) => {
  const order = await orderService.createOrder({
    /*user: req.user,*/
    items: req.body.items,
    sessions: req.body.sessions,
    /* TODO:must be add company from barcode */
  });

  await pushService.pusher.trigger('this.props.user.id', 'orderCompleted', { order });

  /* let iyzicoRequest = {
    card: req.body.card,
    order: unPaidOrder,
    user: req.user,
  };
  const iyzi = await start3DPayment(iyzicoRequest);*/

  res.status(httpStatus.CREATED).send({ order });
});

/**
 * Banka, kullan??c?? cep telefonuna gelen mesaj?? 3D ekran??na girdiyse
 * banka bu i??lemin sonucu bildirmek i??in buraya geliyor.
 * Burada cep ??ifresinin do??ru girildi??inin sonucu gelir.
 * Bu paran??n hesaptan ??ekildi??i anlam??na gelmez.
 * ??ifre do??ru girildiyse, daha sonra iyzico ile ileti??ime ge??erek paran??n ??ekilip ??ekilmedi??ini
 * sorgulamal??y??z. O zaman ??deme i??lemini tamamlay??p krediyi eklemeye ba??layaca????z.
 */
const iyziCallback = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.body.conversationId);

  // If 3d secure password true
  if (req.body.status === 'success') {
    const complete3D = await complete3DPayment(order, req.body.paymentId, req.body.conversationData);

    // If credit card checkout completed on iyzico.
    if (complete3D.status === 'success') {
      const paidOrder = await orderService.approveOrder(req.body.conversationId, complete3D);
      const balance = await cashierService.getBalance(order.user.id);
      // We trigged on orderCompleted event
      await pushService.pusher.trigger(order.user.id, 'orderCompleted', { paidOrder, balance });
      res.status(httpStatus.OK).send('Tamamland??, y??nlendiriliyorsunuz.');
    } else {
      // We trigged on orderDeclined event
      await pushService.pusher.trigger(order.user.id, 'orderDeclined', { complete3D });
      res.status(httpStatus.OK).send('??deme al??namad??, l??tfen tekrar deneyiniz.');
    }
  }

  if (req.body.status === 'failure') {
    await pushService.pusher.trigger(order.user.id, 'orderDeclined', { errorMessage: 'Hata ' });

    console.log('callback error', req);
    res.status(httpStatus.NOT_MODIFIED).send('Hata olu??tu, yeniden denemeniz gerekiyor.');
  }
});

/**
 * Completed apple payment
 */
const applePayment = catchAsync(async (req, res) => {
  console.log('gelen istek', req.body);
  const reqData = JSON.stringify({
    'receipt-data': req.body.transactionReceipt,
    password: '8b25a60f1c3c4d989392492d460cad77',
  });

  const verify = await axios.post(
    'https://buy.itunes.apple.com/verifyReceipt',
    //'https://sandbox.itunes.apple.com/verifyReceipt',
    reqData,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Burada kredi y??kleme i??lemleri yap??lacak.
  console.log('type', verify.data);

  let appleAnswer;
  if (verify.data.status === 0) {
    console.log('gelen ??r??n', verify.data.latest_receipt_info[0].product_id);
    const product = await productService.getProductByAppleSku(verify.data.latest_receipt_info[0].product_id);
    const createdOrder = await orderService.createOrderApple({
      user: req.user.id,
      items: [product],
      completed: true,
      acoin: product.acoin,
      appleResponse: verify.data,
    });
    console.log('product.acoin', product.acoin);
    // Burada kredi y??kleme i??lemleri yap??lacak.

    appleAnswer = true;
  } else {
    appleAnswer = verify.data.status;
  }

  res.status(httpStatus.OK).send(appleAnswer);
});

module.exports = {
  getOrder,
  getMyOrders,
  getMyOrdersViaMySessions,
  updateOrder,
  getOrders,
  createPayment,
  createOrder,
  iyziCallback,
  applePayment,
};
