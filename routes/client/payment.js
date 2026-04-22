const express = require("express");
const momoPayment = require("../services/momoPayment");

const router = express.Router();

router.post("/momo", async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // URL điều hướng sau khi thanh toán thành công
        const returnUrl = "http://localhost:3000/payment-success";
        const notifyUrl = "http://localhost:3000/payment-notify";

        const orderInfo = `Thanh toán vé phim - Mã đơn: ${orderId}`;
        const payUrl = await momoPayment(orderId, amount, orderInfo, returnUrl, notifyUrl);

        res.json({ payUrl });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo thanh toán MoMo" });
    }
});

module.exports = router;
