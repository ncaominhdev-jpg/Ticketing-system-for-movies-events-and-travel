require('dotenv').config();
const crypto = require('crypto');
const https = require('https');
const OrderModel = require('../../models/orderModel'); // Import model đơn hàng nếu dùng DB

class PaymentController {
    // 👉 Tạo yêu cầu thanh toán MoMo
    static async createPayment(req, res) {
        try {
            const { user_id, tour_id, selected_seats, total_price } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!user_id || !tour_id || !selected_seats || !total_price) {
                return res.status(400).json({ message: 'Thiếu thông tin đặt hàng' });
            }

            // Thông tin MoMo
            const partnerCode = process.env.PARTNER_CODE;
            const accessKey = process.env.ACCESS_KEY;
            const secretKey = process.env.SECRET_KEY;
            const redirectUrl = process.env.REDIRECT_URL;
            const ipnUrl = process.env.IPN_URL;

            const requestId = partnerCode + new Date().getTime();
            const orderId = requestId; // Momo yêu cầu orderId duy nhất
            const orderInfo = `Thanh toán tour #${tour_id} - Người dùng ${user_id}`;
            const requestType = "captureWallet";
            const extraData = selected_seats.join(", "); // Lưu ghế ngồi đã chọn

            // 🔹 Chuẩn bị chuỗi chữ ký
            const rawSignature = `accessKey=${accessKey}&amount=${total_price}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            // 🔹 Tạo chữ ký HMAC SHA256
            const signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            // 🔹 Chuẩn bị request body gửi MoMo
            const requestBody = JSON.stringify({
                partnerCode,
                accessKey,
                requestId,
                amount: total_price,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'vi'
            });

            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            };

            // 🔹 Gửi yêu cầu đến MoMo
            const momoReq = https.request(options, (momoRes) => {
                let data = '';

                momoRes.on('data', (chunk) => {
                    data += chunk;
                });

                momoRes.on('end', async () => {
                    try {
                        const response = JSON.parse(data);
                        console.log("🔹 MoMo Response: ", response);

                        if (response.payUrl) {
                            // 🔹 Lưu đơn hàng vào DB (không lưu order_id và status)
                            await OrderModel.create({
                                user_id,
                                tour_id,
                                selected_seats: selected_seats.join(", "),
                                total_price,
                                status: "PENDING",
                            });

                            // Trả về link thanh toán cho client
                            return res.json({ payUrl: response.payUrl });
                        } else {
                            return res.status(500).json({ message: "Không thể tạo thanh toán MoMo" });
                        }
                    } catch (error) {
                        console.error("🔸 Lỗi phân tích phản hồi MoMo: ", error);
                        return res.status(500).json({ message: "Lỗi xử lý thanh toán" });
                    }
                });
            });

            momoReq.on('error', (e) => {
                console.error("🔸 Request Error: ", e.message);
                return res.status(500).json({ message: "Lỗi khi gửi yêu cầu đến MoMo" });
            });

            // Gửi dữ liệu đến MoMo
            momoReq.write(requestBody);
            momoReq.end();
        } catch (error) {
            console.error("🔸 Error: ", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }

    // 👉 Nhận phản hồi thanh toán từ MoMo (IPN callback)
    static async handleIpn(req, res) {
        try {
            const { orderId, resultCode, message } = req.body;

            console.log("🔹 Nhận phản hồi từ MoMo: ", req.body);

            if (!orderId) {
                return res.status(400).json({ message: "Thiếu orderId" });
            }

            // Tìm đơn hàng theo orderId
            const order = await OrderModel.findOne({ user_id: req.body.user_id, tour_id: req.body.tour_id });

            if (!order) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            if (resultCode === 0) {
                // ✅ Thanh toán thành công
                order.status = "PAID";
                await order.save();
                console.log(`🔹 Đơn hàng của người dùng ${order.user_id} đã thanh toán thành công.`);
                return res.json({ message: "Thanh toán thành công", orderId });
            } else {
                // ❌ Thanh toán thất bại
                order.status = "FAILED";
                await order.save();
                console.log(`🔸 Đơn hàng của người dùng ${order.user_id} thất bại: ${message}`);
                return res.status(400).json({ message: "Thanh toán thất bại", reason: message });
            }
        } catch (error) {
            console.error("🔸 Lỗi xử lý IPN: ", error);
            return res.status(500).json({ message: "Lỗi xử lý phản hồi MoMo" });
        }
    }
}

module.exports = PaymentController;
