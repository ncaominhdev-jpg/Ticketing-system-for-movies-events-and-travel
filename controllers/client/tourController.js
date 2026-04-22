const e = require("express");
const moment = require("moment");
const TourModel = require("../../models/tourModel");
const TravelItineraryModel = require("../../models/travelItineraryModel");
const OrderModel = require("../../models/orderModel");

class TourController {
  static async getTours(req, res) {
    try {
      const tours = await TourModel.findAll();
      res.status(200).render("client/tour/list", {
        title: "Danh sách Tour - Du lịch",
        tours: tours,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Hiển thị chi tiết tour
  static async getTourDetail(req, res) {
    try {
      const { id } = req.params;

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(id);

      // Kiểm tra nếu tour không tồn tại
      if (!tour) {
        return res
          .status(404)
          .render("client/tour/not-found", { title: "Tour Not Found" });
      }

      // Kiểm tra xem departure_date và end_date có hợp lệ không
      if (!tour.departure_date || !tour.end_date) {
        return res
          .status(400)
          .json({ error: "Ngày khởi hành hoặc kết thúc không hợp lệ" });
      }

      // Chuyển đổi ngày thành đối tượng Date
      const departureDate = moment(tour.departure_date);
      const endDate = moment(tour.end_date);

      console.log("Moment version:", moment.version);

      // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày khởi hành
      if (endDate.isBefore(departureDate)) {
        return res.status(400).json({
          error: "Ngày kết thúc phải lớn hơn hoặc bằng ngày khởi hành",
        });
      }

      // Tính số ngày và số đêm
      const totalDays = endDate.diff(departureDate, "days") + 1;
      const totalNights = totalDays - 1;

      // Tìm lịch trình liên quan đến tour
      const travelItinerary = await TravelItineraryModel.findAll({
        where: { tour_id: req.params.id }, // Dùng 'tour_id' thay vì 'tourId'
      });

      // Render trang chi tiết tour và truyền dữ liệu
      res.status(200).render("client/tour/details", {
        title: "Detail Tour",
        tour,
        travelItinerary,
        totalDays,
        totalNights,
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết tour:", error); // Log lỗi chi tiết hơn
      res.status(500).render("client/tour/error", {
        title: "Lỗi Server",
        message: "Có lỗi xảy ra, vui lòng thử lại sau!",
      });
    }
  }

  static async getBuyTickets(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid tour ID" });
      }

      const tour = await TourModel.findByPk(id);

      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }

      // Kiểm tra ngày hợp lệ
      if (!tour.departure_date || !tour.end_date) {
        return res
          .status(400)
          .json({ error: "Ngày khởi hành hoặc kết thúc không hợp lệ" });
      }

      const departureDate = moment(tour.departure_date);
      const endDate = moment(tour.end_date);

      if (endDate.isBefore(departureDate)) {
        return res.status(400).json({
          error: "Ngày kết thúc phải lớn hơn hoặc bằng ngày khởi hành",
        });
      }

      const totalDays = endDate.diff(departureDate, "days") + 1;
      const totalNights = totalDays - 1;

      // Dữ liệu giả định cho sơ đồ ghế (5 hàng, 4 cột)
      const seats = [
        ["A1", "A2", "", "A3", "A4"],
        ["B1", "B2", "", "B3", "B4"],
        ["C1", "C2", "", "C3", "C4"],
        ["D1", "D2", "", "D3", "D4"],
        ["E1", "E2", "", "E3", "E4"],
        ["F1", "F2", "", "F3", "F4"],
        ["G1", "G2", "", "G3", "G4"],
        ["H1", "H2", "", "H3", "H4"],
        ["I1", "I2", "", "I3", "I4"],
        ["J1", "J2", "", "J3", "J4"],
      ];

      //kiểm tra ghế đã đặt
      const orders = await OrderModel.findAll({
        where: { tour_id: id },
        attributes: ["selected_seats"],
        raw: true,
      });

      res.status(200).render("client/tour/buy-tickets", {
        tour,
        departureDates: tour.departureDates || [],
        ticketPrice: tour.price,
        totalDays,
        totalNights,
        orders, // Truyền dữ liệu đơn hàng vào view
        seats, // Truyền dữ liệu ghế vào view
        title: "Buy Tickets",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPayTickets(req, res) {
    try {
      const { id } = req.params; // Lấy ID tour từ URL
      const { seats, total } = req.query; // Lấy danh sách ghế và tổng tiền từ query params

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res.status(404).render("client/tour/no-tour", {
          title: "Tour Không Tồn Tại",
        });
      }

      // Chuyển đổi ngày thành đối tượng Date
      const departureDate = moment(tour.departure_date);
      const endDate = moment(tour.end_date);

      console.log("Moment version:", moment.version);

      // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày khởi hành
      if (endDate.isBefore(departureDate)) {
        return res.status(400).json({
          error: "Ngày kết thúc phải lớn hơn hoặc bằng ngày khởi hành",
        });
      }

      // Tính số ngày và số đêm
      const totalDays = endDate.diff(departureDate, "days") + 1;
      const totalNights = totalDays - 1;

      // Render trang thanh toán với dữ liệu
      res.status(200).render("client/tour/pay-tickets", {
        title: `Thanh Toán - ${tour.destination}`,
        tour,
        totalDays,
        totalNights,
        selectedSeats: seats ? seats.split(",") : [], // Chuyển chuỗi thành mảng ghế
        totalPrice: total ? parseInt(total) : 0, // Chuyển tổng tiền về kiểu số
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vé:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
  }

  static async postPayTickets(req, res) {
    try {
      let { user_id, tour_id, selected_seats, total_price } = req.body;

      console.log("Dữ liệu nhận từ client:", selected_seats);
      console.log("Kiểu dữ liệu nhận được:", typeof selected_seats);

      if (!user_id || !tour_id || !selected_seats || !total_price) {
        return res.status(400).json({ message: "Thông tin đơn hàng không hợp lệ" });
      }

      // Tạo đơn hàng
      const order = await OrderModel.create({
        user_id,
        tour_id,
        selected_seats: selected_seats.join(", "), // Chuyển thành chuỗi cách nhau bởi dấu phẩy
        total_price,
      });

      res.status(201).json({ message: "Đơn hàng đã được ghi nhận!", order });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
  }
}
module.exports = TourController;
