const e = require("express");
const ConcertModel = require("../../models/concertModel");
const artistImageModel = require("../../models/artistImageModel");
const Order = require("../../models/orderModel");
const UserModel = require("../../models/userModel");

class ConcertController {
  static async getConcerts(req, res) {
    try {
      const concerts = await ConcertModel.findAll();
      res.status(200).render("client/concert/list", {
        title: "Vé Sự Kiện - Concert",
        concerts: concerts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getConcertDetail(req, res) {
    try {
      const { id } = req.params;

      const concert = await ConcertModel.findByPk(id);
      if (!concert) {
        return res.status(404).json({ error: "Concert not found" });
      }

      const artistImages = await artistImageModel.findAll({
        where: { concert_id: req.params.id },
      });

      // Render trang chi tiết concert, truyền biến concert vào view
      res.status(200).render("client/concert/details", {
        title: concert.name,
        concert,
        artistImages,
      });
    } catch (error) {
      console.error("Error fetching concert details:", error);
      res
        .status(500)
        .render("client/concert/error", { title: "Lỗi Server", error: "" });
    }
  }
  static async getBuyTickets(req, res) {
    try {
      const { id } = req.params; // Lấy ID từ URL

      // Kiểm tra nếu không có ID
      if (!id) {
        return res.status(400).json({ message: "ID concert không hợp lệ" });
      }

      // Tìm concert trong database
      const concert = await ConcertModel.findByPk(id); // Sequelize
      // const concert = await ConcertModel.findById(id); // Nếu dùng Mongoose

      if (!concert) {
        return res.status(404).json({ message: "Concert không tồn tại" });
      }

      // Lấy danh sách ghế đã đặt từ DB
      const orders = await Order.findAll({
        where: { concert_id: id },
        attributes: ["selected_seats"], // Chỉ lấy cột ghế đã đặt
        raw: true,
      });
      // Chuyển đổi danh sách ghế từ chuỗi thành mảng
      const reservedSeats = orders
        .map((order) => order.selected_seats.split(", ")) // Tách thành mảng
        .flat(); // Gộp tất cả thành một mảng duy nhất

      console.log("Danh sách ghế đã đặt:", reservedSeats);

      res.status(200).render("client/concert/buy-tickets", {
        title: "Buy Tickets",
        concert, // Gửi dữ liệu concert đến giao diện
        reservedSeats, // Gửi danh sách ghế đã đặt đến giao diện
      });
    } catch (error) {
      console.error("Lỗi khi lấy concert:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getPayTickets(req, res) {
    try {
      const { id } = req.params; // Lấy ID concert từ URL
      const { seats, total } = req.query; // Lấy ghế ngồi và tổng tiền từ query params

      // Lấy thông tin concert theo ID
      const concert = await ConcertModel.findByPk(id);
      if (!concert) {
        return res.status(404).render("client/concert/not-found", {
          title: "Concert Not Found",
        });
      }

      // Format ngày diễn
      const formattedDate = concert.event_date
        ? new Date(concert.event_date).toLocaleDateString("vi-VN")
        : "Không có ngày";

      // Render trang thanh toán vé
      res.status(200).render("client/concert/pay-tickets", {
        title: `Thanh toán - ${concert.name}`,
        concert,
        eventDate: formattedDate,
        selectedSeats: seats ? seats.split(",") : [],
        totalPrice: total ? parseInt(total) : 0,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thanh toán vé:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
  }

  static async postPayTickets(req, res) {
    try {
      let { user_id, concert_id, selected_seats, total_price } = req.body;
  
      console.log("Dữ liệu nhận từ client:", selected_seats);
      console.log("Kiểu dữ liệu nhận được:", typeof selected_seats);
  
      if (!user_id || !concert_id || !selected_seats || !total_price) {
        return res.status(400).json({ message: "Thông tin đơn hàng không hợp lệ" });
      }
      
      // Tạo đơn hàng
      const order = await Order.create({
        user_id,
        concert_id,
        selected_seats: selected_seats.join(", "), // Chuyển thành chuỗi cách nhau bởi dấu phẩy
        total_price,
      });
  
      res.status(201).json({ message: "Đơn hàng đã được ghi nhận!", order });
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
  
  
}

module.exports = ConcertController;
