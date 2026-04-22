const e = require("express");
const { Op } = require("sequelize");
const MovieModel = require("../../models/movieModel");
const MovieDate = require("../../models/movieDateModel");
const MovieShowtime = require("../../models/movieShowtimeModel");
const Order = require("../../models/orderModel");
const { format } = require("mysql2");

class MovieController {
  // Lấy tất cả sản phẩm và hiển thị trên giao diện
  static async getAllMovies(req, res) {
    try {
      const movies = await MovieModel.findAll(); // Lấy danh sách phim từ database
      res.status(200).render("client/movie/list", {
        title: "Danh Sách Phim",
        movies: movies,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Hiển thị chi tiết sản phẩm (phim)
  static async getMovieDetail(req, res) {
    try {
      const { id } = req.params;

      // Tìm phim theo ID
      const movie = await MovieModel.findByPk(id);

      // Kiểm tra nếu phim không tồn tại
      if (!movie) {
        return res
          .status(404)
          .render("client/errors/404", { title: "Movie Not Found" });
      }

      // Ngày hiện tại
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Lấy danh sách ngày chiếu
      const movieDates = await MovieDate.findAll({
        where: {
          movie_id: id,
          date_show: { [Op.gte]: today }, // Chỉ lấy ngày từ hôm nay trở đi
        },
        order: [["date_show", "ASC"]],
        attributes: ["id", "date_show"],
      });
      console.log("Dữ liệu ngày chiếu:", movieDates);

      // Lấy tất cả giờ chiếu của phim này
      const movieTimes = await MovieShowtime.findAll({
        where: {
          movie_date_id: { [Op.in]: movieDates.map((d) => d.id) }, // Lấy giờ chiếu theo ngày chiếu
        },
        order: [["show_time", "ASC"]],
        attributes: ["id", "movie_date_id", "show_time"],
        raw: true,
      });

      console.log("Kết quả MovieShowtime sau khi ép kiểu:", movieTimes);

      // Render trang chi tiết phim và truyền dữ liệu
      res.status(200).render("client/movie/details", {
        title: movie.name,
        movie,
        movieDates,
        movieTimes,
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phim:", error);
      res.status(500).render("client/errors/404", {
        title: "Lỗi Hệ Thống",
        message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  }
  // hiển thị buy-tickets.ejs
  static async getBuyTickets(req, res) {
    try {
      const { id } = req.params; // ID của suất chiếu phim

      // Tìm suất chiếu theo ID
      const showtime = await MovieShowtime.findByPk(id, { raw: true });

      // Nếu không tìm thấy suất chiếu
      if (!showtime) {
        return res.status(404).render("client/movie/no-showtimes", {
          title: "Không có suất chiếu",
        });
      }

      // Lấy thông tin ngày chiếu từ movie_date_id trong bảng MovieShowtime
      const movieDate = await MovieDate.findByPk(showtime.movie_date_id, {
        raw: true,
      });

      if (!movieDate) {
        return res.status(404).render("client/movie/no-showtimes", {
          title: "Không có thông tin ngày chiếu",
        });
      }

      // Lấy thông tin phim từ movie_id trong bảng MovieDate
      const movie = await MovieModel.findByPk(movieDate.movie_id, {
        raw: true,
      });

      if (!movie) {
        return res.status(404).render("client/movie/not-found", {
          title: "Không tìm thấy phim",
        });
      }

      // Lấy tất cả suất chiếu theo ngày chiếu (để hiển thị danh sách lựa chọn)
      const movieShowtimes = await MovieShowtime.findAll({
        where: { movie_date_id: movieDate.id }, // Lọc theo ngày chiếu
        attributes: ["id", "show_time", "vip_price", "normal_price"],
        raw: true,
      });

      // Chuyển đổi giá trị giá vé từ chuỗi sang số
      const formattedShowtimes = movieShowtimes.map((s) => ({
        id: s.id,
        show_time: s.show_time,
        vip_price: Number(s.vip_price),
        normal_price: Number(s.normal_price),
      }));

      // Lấy danh sách ghế đã đặt của suất chiếu
      const bookedSeats = await Order.findAll({
        where: { movie_showtimes_id: id },
        attributes: ["selected_seats"], // Lấy cột ghế đã đặt
        raw: true,
      });

      // Chuyển danh sách ghế từ chuỗi sang mảng
      const reservedSeats = bookedSeats
        .flatMap((order) => order.selected_seats.split(",")) // Tách chuỗi thành mảng ghế
        .map((seat) => seat.trim()); // Loại bỏ khoảng trắng thừa

      console.log("Danh sách ghế đã đặt:", reservedSeats);

      // Render trang đặt vé với danh sách ghế đã đặt
      res.status(200).render("client/movie/buy-tickets", {
        title: `Đặt vé - ${movie.name}`,
        movie,
        movieDate,
        id: showtime.id,
        show_time: showtime.show_time,
        vip_price: Number(showtime.vip_price),
        normal_price: Number(showtime.normal_price),
        movieShowtimes: formattedShowtimes,
        reservedSeats, // Danh sách ghế đã đặt để hiển thị trên giao diện
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vé:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
  }

  //get pay-tickets
  static async getPayTickets(req, res) {
    try {
      const { id } = req.params; // Lấy ID suất chiếu từ URL
      const { seats, total } = req.query; // Dữ liệu từ query params

      // Lấy suất chiếu theo ID
      const showtime = await MovieShowtime.findByPk(id);
      if (!showtime) {
        return res.status(404).render("client/movie/no-showtimes", {
          title: "No Showtimes Available",
        });
      }

      // Lấy ngày chiếu
      const movieDate = await MovieDate.findByPk(showtime.movie_date_id);
      if (!movieDate) {
        return res.status(404).render("client/movie/not-found", {
          title: "Movie Not Found",
        });
      }

      // Lấy thông tin phim
      const movie = await MovieModel.findByPk(movieDate.movie_id);
      if (!movie) {
        return res.status(404).render("client/movie/not-found", {
          title: "Movie Not Found",
        });
      }

      // Format ngày cho dễ đọc
      const formattedDate = movieDate.date_show
        ? new Date(movieDate.date_show).toLocaleDateString("vi-VN")
        : "Không có ngày";

      // Render trang thanh toán
      res.status(200).render("client/movie/pay-tickets", {
        title: movie.name,
        movie,
        showtime,
        movieDate: formattedDate,
        selectedSeats: seats ? seats.split(",") : [], // Nếu không có ghế thì mặc định []
        totalPrice: total ? parseInt(total) : 0,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vé:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ!" });
    }
  }

  //post pay-tickets
  static async postPayTickets(req, res) {
    try {
        let { user_id, movie_showtimes_id, selected_seats, total_price } = req.body;

        console.log("Dữ liệu nhận từ client:", selected_seats);
        console.log("Kiểu dữ liệu nhận được:", typeof selected_seats);

        if (!user_id || !movie_showtimes_id || !selected_seats || !total_price) {
            return res.status(400).json({ message: "Thông tin đơn hàng không hợp lệ" });
        }

        // Tạo đơn hàng
        const order = await Order.create({
            user_id,
            movie_showtimes_id,
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

module.exports = MovieController;
