require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");

const momoPayment = async (orderId, amount, orderInfo, returnUrl, notifyUrl) => {
    try {
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const requestId = `${orderId}-${Date.now()}`;
        const extraData = "";

        // Chuỗi raw data cần mã hóa HMAC SHA256
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;
        
        // Mã hóa SHA256
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        // Dữ liệu gửi lên MoMo
        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: returnUrl,
            ipnUrl: notifyUrl,
            extraData,
            requestType: "captureWallet",
            signature
        };

        // Gửi yêu cầu đến API MoMo
        const response = await axios.post(process.env.MOMO_API_ENDPOINT, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.payUrl; // Link thanh toán MoMo
    } catch (error) {
        console.error("Lỗi thanh toán MoMo:", error);
        throw error;
    }
};

module.exports = momoPayment;
