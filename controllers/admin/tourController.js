const e = require("express");
const path = require("path");
const TourModel = require("../../models/tourModel");
const TravelItineraryModel = require("../../models/travelItineraryModel");

class AdminTourController {
  static async getTourList(req, res) {
    try {
      const tours = await TourModel.findAll();
      res.render("admin/tour/list", { title: "Danh Sách Tour Du Lịch", tours });
    } catch (error) {
      console.error("Lỗi lấy danh sách tour:", error);
      res.status(500).send("Lỗi server");
    }
  }

  static async getFormAddTour(req, res) {
    try {
      res.render("admin/tour/add", {
        title: "Thêm Tour Mới",
        errors: {},
        formData: {}, // Thêm biến formData để tránh lỗi undefined
      });
    } catch (error) {
      console.error("Lỗi khi hiển thị form thêm tour:", error);
      res.status(500).send("Lỗi server");
    }
  }

  // Xử lý thêm tour
  static async postAddTour(req, res) {
    const {
      departure_point,
      destination,
      departure_date,
      end_date,
      location,
      price,
    } = req.body;
    const errors = {};
    const formData = {
      departure_point,
      destination,
      departure_date,
      end_date,
      location,
      price,
    };

    // Bắt lỗi dữ liệu trống
    if (!departure_point)
      errors.departure_point = "Điểm khởi hành không được để trống.";
    if (!destination) errors.destination = "Điểm đến không được để trống.";
    if (!departure_date)
      errors.departure_date = "Ngày khởi hành không được để trống.";
    if (!end_date) errors.end_date = "Ngày kết thúc không được để trống.";
    if (!location) errors.location = "Địa điểm không được để trống.";
    if (!price) errors.price = "Giá tour không được để trống.";

    // Kiểm tra giá tour phải là số
    if (price && isNaN(price)) {
      errors.price = "Giá tour phải là số.";
    }

    // Kiểm tra ngày hợp lệ
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)
    if (departure_date && departure_date < today) {
      errors.departure_date = "Ngày khởi hành phải lớn hơn ngày hiện tại.";
    }
    if (departure_date && end_date && departure_date >= end_date) {
      errors.end_date = "Ngày kết thúc phải lớn hơn ngày khởi hành.";
    }

    // Kiểm tra hình ảnh
    if (!req.file) {
      errors.image_url = "Vui lòng tải lên một tệp hình ảnh.";
    } else {
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".gif"].includes(fileExt)) {
        errors.image_url =
          "Chỉ chấp nhận file hình ảnh (.jpg, .jpeg, .png, .gif).";
      }
    }

    // Nếu có lỗi, render lại form với thông báo lỗi và dữ liệu đã nhập
    if (Object.keys(errors).length > 0) {
      return res.render("admin/tour/add", {
        title: "Thêm Tour Mới",
        errors,
        formData, // Trả lại dữ liệu người dùng đã nhập
      });
    }

    try {
      // Lưu tour vào database
      await TourModel.create({
        departure_point,
        destination,
        departure_date,
        end_date,
        location,
        price,
        image_url: req.file.filename, // Lưu tên file ảnh
      });

      res.redirect("/admin/tour/list"); // Chuyển hướng sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi khi thêm tour:", error);
      res.status(500).send("Lỗi server");
    }
  }

  static async getFormEditTour(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Thiếu ID tour" });
      }

      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res.status(404).json({ error: "Không tìm thấy tour du lịch" });
      }

      res.render("admin/tour/edit", {
        title: "Sửa Tour Du Lịch",
        tour,
        errors: {},
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tour:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  // Xử lý sửa tour
  static async postEditTour(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Thiếu ID tour" });
      }

      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res.status(404).json({ error: "Tour không tồn tại" });
      }

      const {
        departure_point,
        destination,
        departure_date,
        end_date,
        location,
        price,
      } = req.body;
      const errors = {};

      // Kiểm tra dữ liệu nhập vào
      if (!departure_point)
        errors.departure_point = "Điểm khởi hành không được để trống.";
      if (!destination) errors.destination = "Điểm đến không được để trống.";
      if (!location) errors.location = "Địa điểm không được để trống.";

      // Kiểm tra ngày hợp lệ
      const today = new Date();
      const departureDateObj = departure_date ? new Date(departure_date) : null;
      const endDateObj = end_date ? new Date(end_date) : null;

      if (!departure_date) {
        errors.departure_date = "Ngày khởi hành không được để trống.";
      } else if (departureDateObj <= today) {
        errors.departure_date = "Ngày khởi hành phải lớn hơn ngày hiện tại.";
      }

      if (!end_date) {
        errors.end_date = "Ngày kết thúc không được để trống.";
      } else if (
        departureDateObj &&
        endDateObj &&
        departureDateObj >= endDateObj
      ) {
        errors.end_date = "Ngày kết thúc phải lớn hơn ngày khởi hành.";
      }

      // Kiểm tra giá
      if (!price) {
        errors.price = "Giá tour không được để trống.";
      } else if (isNaN(price) || Number(price) <= 0) {
        errors.price = "Giá tour phải là số dương.";
      }

      // Kiểm tra hình ảnh nếu có upload mới
      let image_url = tour.image_url;
      if (req.file) {
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

        if (
          !allowedExtensions.includes(fileExt) ||
          !allowedMimeTypes.includes(req.file.mimetype)
        ) {
          errors.image_url =
            "Chỉ chấp nhận file hình ảnh (.jpg, .jpeg, .png, .gif).";
        } else if (req.file.size > 5 * 1024 * 1024) {
          errors.image_url =
            "Kích thước file ảnh quá lớn. Chỉ tải lên file dưới 5MB.";
        } else {
          image_url = req.file.filename;
        }
      }

      // Nếu có lỗi, render lại form với dữ liệu cũ
      if (Object.keys(errors).length > 0) {
        return res.render("admin/tour/edit", {
          title: "Sửa Tour Du Lịch",
          tour: {
            id,
            departure_point,
            destination,
            location,
            departure_date,
            end_date,
            price,
            image_url,
          },
          errors,
        });
      }

      // Cập nhật tour
      await tour.update({
        departure_point,
        destination,
        location,
        departure_date,
        end_date,
        price,
        image_url,
      });

      res.redirect(`/admin/tour/details/${tour.id}`);
    } catch (error) {
      console.error("Lỗi khi sửa tour:", error);
      res.status(500).json({ error: "Lỗi server." });
    }
  }

  static async getTourDetails(req, res) {
    try {
      const { id } = req.params;

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res
          .status(404)
          .render("errors/404", { message: "Tour không tồn tại." });
      }

      // Lấy danh sách lịch trình của tour
      const travelItinerary = await TravelItineraryModel.findAll({
        where: { tour_id: id },
        order: [["travel_date", "ASC"]],
      });

      // Tính số ngày và số đêm của tour
      const departureDate = new Date(tour.departure_date);
      const endDate = new Date(tour.end_date);
      const totalDays =
        Math.ceil((endDate - departureDate) / (1000 * 60 * 60 * 24)) + 1;
      const totalNights = totalDays - 1;

      // Kiểm tra nếu lịch trình đã đủ số ngày
      const isItineraryComplete = travelItinerary.length >= totalDays;

      res.render("admin/tour/details", {
        title: `Chi tiết Tour - ${tour.destination}`,
        tour,
        travelItinerary,
        totalDays,
        totalNights,
        isItineraryComplete, // Truyền biến này xuống view EJS
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết tour:", error);
      res
        .status(500)
        .render("errors/500", { message: "Lỗi server, vui lòng thử lại sau." });
    }
  }

  static async deleteTour(req, res) {
    try {
      const { id } = req.params;

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res.status(404).json({ error: "Tour không tồn tại." });
      }

      // Xóa lịch trình của tour
      await TravelItineraryModel.destroy({ where: { tour_id: id } });

      // Xóa tour
      await tour.destroy();

      return res.status(200).json({ message: "Xóa tour thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa tour:", error);
      return res.status(500).json({ error: "Lỗi server, không thể xóa tour." });
    }
  }

  static async getFormAddTravelItinerary(req, res) {
    try {
      const { id } = req.params;

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(id);
      if (!tour) {
        return res
          .status(404)
          .render("errors/404", { message: "Tour không tồn tại." });
      }

      res.render("admin/tour/add-travelitinerary", {
        title: "Thêm Lịch Trình Tour",
        tour,
        errors: {},
      });
    } catch (error) {
      console.error("L��i khi lấy dữ liệu lịch trình:", error);
      res.status(500).json({ error: "L��i server." });
    }
  }

  static async AddTravelItinerary(req, res) {
    const { travel_date, itinerary } = req.body;
    const tour_id = req.params.id; // Lấy ID tour từ URL hoặc body

    try {
      // Kiểm tra tour có tồn tại không
      const tour = await TourModel.findByPk(tour_id);
      if (!tour) {
        return res.status(404).render("admin/tour/add-travelItinerary", {
          title: "Thêm Lịch Trình Tour",
          errors: { tour_id: "Tour không tồn tại!" },
          tour: {},
        });
      }

      let errors = {};

      if (!travel_date) {
        errors.travel_date = "Ngày đi không được để trống!";
      } else {
        const travelDateObj = new Date(travel_date);
        const departureDate = new Date(tour.departure_date);
        const endDate = new Date(tour.end_date);

        if (travelDateObj < departureDate || travelDateObj > endDate) {
          errors.travel_date = `Ngày đi phải từ ${departureDate.toLocaleDateString(
            "vi-VN"
          )} đến ${endDate.toLocaleDateString("vi-VN")}!`;
        }

        // Kiểm tra ngày đã tồn tại trong cùng tour_id
        const existingItinerary = await TravelItineraryModel.findOne({
          where: {
            travel_date: new Date(travel_date),
            tour_id,
          },
        });

        if (existingItinerary) {
          errors.travel_date = "Ngày này đã tồn tại trong lịch trình!";
        }
      }

      if (!itinerary) {
        errors.itinerary = "Hành trình không được để trống!";
      }

      // Nếu có lỗi, render lại form với lỗi
      if (Object.keys(errors).length > 0) {
        return res.render("admin/tour/add-travelItinerary", {
          title: "Thêm Lịch Trình Tour",
          errors,
          tour,
        });
      }

      // Lưu lịch trình mới
      await TravelItineraryModel.create({ travel_date, itinerary, tour_id });

      // Chuyển hướng về danh sách lịch trình
      res.redirect(`/admin/tour/details/${tour_id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }

  static async getFormEditTravelItinerary(req, res) {
    try {
      const { id } = req.params;

      // Tìm lịch trình theo ID
      const itinerary = await TravelItineraryModel.findByPk(id);
      if (!itinerary) {
        return res
          .status(404)
          .render("errors/404", { message: "Lịch trình không tồn tại." });
      }

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(itinerary.tour_id);
      if (!tour) {
        return res
          .status(404)
          .render("errors/404", { message: "Tour không tồn tại." });
      }

      res.render("admin/tour/edit-travelitinerary", {
        title: "Sửa Lịch Trình Tour",
        itinerary,
        tour,
        errors: {},
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu lịch trình:", error);
      res.status(500).json({ error: "Lỗi server." });
    }
  }

  static async postEditTravelItinerary(req, res) {
    const { id } = req.params;
    const { itinerary } = req.body;

    try {
      // Tìm lịch trình theo ID

      const travelItinerary = await TravelItineraryModel.findByPk(id);
      if (!travelItinerary) {
        return res
          .status(404)
          .render("errors/404", { message: "Lịch trình không tồn tại." });
      }

      // Tìm tour theo ID
      const tour = await TourModel.findByPk(travelItinerary.tour_id);
      if (!tour) {
        return res
          .status(404)
          .render("errors/404", { message: "Tour không tồn tại." });
      }

      // Kiểm tra dữ liệu nhập vào
      const errors = {};
      if (!itinerary) {
        errors.itinerary = "Hành trình không được để trống.";
      }

      // Nếu có lỗi, render lại form với dữ liệu cũ
      if (Object.keys(errors).length > 0) {
        return res.render("admin/tour/edit-travelitinerary", {
          title: "Sửa Lịch Trình Tour",
          itinerary: travelItinerary,
          tour,
          errors,
        });
      }

      // Cập nhật lịch trình
      await travelItinerary.update({ itinerary });

      // Chuyển hướng về trang chi tiết tour
      res.redirect(`/admin/tour/details/${travelItinerary.tour_id}`);
    } catch (error) {
      console.error("Lỗi khi sửa lịch trình:", error);
      res.status(500).json({ error: "Lỗi server." });
    }
  }

  static async deleteTravelItinerary(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra xem lịch trình có tồn tại không
      const itinerary = await TravelItineraryModel.findByPk(id);
      if (!itinerary) {
        return res.status(404).json({ error: "Lịch trình không tồn tại." });
      }

      // Xóa lịch trình
      await itinerary.destroy();

      return res
        .status(200)
        .json({ message: "Lịch trình đã được xóa thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa lịch trình:", error);
      return res
        .status(500)
        .json({ error: "Lỗi server, không thể xóa lịch trình." });
    }
  }
}

module.exports = AdminTourController;
