const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/client/PaymentController');

// Route tạo thanh toán
router.post('/pay', PaymentController.createPayment);

// Route nhận phản hồi IPN từ MoMo
router.post('/momo-ipn', PaymentController.handleIpn);

module.exports = router;
