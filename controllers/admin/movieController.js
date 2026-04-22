const e = require("express");
const MovieModel = require("../../models/movieModel");
const MovieDateModel = require("../../models/movieDateModel");
const MovieShowtimeModel = require("../../models/movieShowtimeModel");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const mime = require("mime-types");

class AdminMovieController {
  // Lấy tất cả sản phẩm và hiển thị trên giao diện
  static async getAllMovies(req, res) {
    try {
      const movies = await MovieModel.findAll();
      res
        .status(200)
        .render("admin/movie/list", { title: "Danh sách phim", movies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovieDate(req, res) {
    try {
      const movie = await MovieModel.findByPk(req.params.id);
      const movieDates = await MovieDateModel.findAll({
        where: { movie_id: req.params.id },
      });
      res.status(200).render("admin/movie/date", {
        title: "Lịch chiếu phim",
        movieDates,
        movie,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovieShowtime(req, res) {
    try {
      // Lấy thông tin ngày chiếu
      const movieDate = await MovieDateModel.findByPk(req.params.id);
      if (!movieDate) {
        return res.status(404).json({ error: "Không tìm thấy ngày chiếu" });
      }

      // Lấy thông tin phim dựa trên movie_id của MovieDateModel
      const movie = await MovieModel.findByPk(movieDate.movie_id);
      if (!movie) {
        return res.status(404).json({ error: "Không tìm thấy phim" });
      }

      // Lấy danh sách giờ chiếu theo movie_date_id
      const movieShowtimes = await MovieShowtimeModel.findAll({
        where: { movie_date_id: movieDate.id },
      });

      // Render trang EJS
      res.status(200).render("admin/movie/showtime", {
        title: "Lịch chiếu phim",
        movieShowtimes,
        movieDate,
        movie,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm mới sản phẩm
  static async getFormAddMovie(req, res) {
    res.render("admin/movie/add-movie", {
      title: "Thêm Phim",
      errors: {},
      name: "",
      genre: "",
      director: "",
      actors: "",
      image_url: "",
      description: "",
      release_date: "",
    }); // Đảm bảo errors không undefined
  }

  static async addMovie(req, res) {
    try {
      const {
        name,
        genre,
        director,
        actors,
        description,
        release_date,
        status,
      } = req.body;
      let errors = {};
      let currentDate = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)

      // Kiểm tra file ảnh có được upload không
      let image_url = "";
      if (req.file) {
        image_url = `${req.file.filename}`;
      }

      // Kiểm tra lỗi nhập liệu
      if (!name || name.trim() === "") {
        errors.name = "Tên danh mục không được để trống.";
      }

      if (!genre || genre.trim() === "") {
        errors.genre = "Thể loại không được để trống.";
      }

      if (!director || director.trim() === "") {
        errors.director = "Đạo diễn không được để trống.";
      }

      if (!actors || actors.trim() === "") {
        errors.actors = "Diễn viên không được để trống.";
      }

      if (!image_url || image_url.trim() === "") {
        errors.image_url = "Hình ảnh không được để trống.";
      } else {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const isValidImage = imageExtensions.some((ext) =>
          image_url.toLowerCase().endsWith(ext)
        );
        if (!isValidImage) {
          errors.image_url =
            "Hình ảnh phải có định dạng .jpg, .jpeg, .png, .gif hoặc .webp.";
        }
      }

      if (!release_date) {
        errors.release_date = "Ngày phát hành không được để trống.";
      } else if (release_date <= currentDate) {
        errors.release_date = "Ngày phát hành phải lớn hơn ngày hiện tại.";
      }

      // Nếu có lỗi, trả về form với dữ liệu cũ
      if (Object.keys(errors).length > 0) {
        return res.render("admin/movie/add-movie", {
          title: "Thêm Phim",
          errors,
          name,
          genre,
          director,
          actors,
          description,
          release_date,
          status,
        });
      }

      // Thêm phim vào database
      await MovieModel.create({
        name,
        genre,
        director,
        actors,
        image_url,
        description,
        release_date,
        status: status || 1,
      });

      res.redirect("/admin/movie/list"); // Chuyển hướng sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Sửa sản phẩm
  static async getFormEditMovie(req, res) {
    try {
      const movie = await MovieModel.findByPk(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: "Không tìm thấy phim" });
      }

      res.render("admin/movie/edit-movie", {
        title: "Sửa Phim",
        movie,
        id: movie.id,
        name: movie.name,
        genre: movie.genre,
        director: movie.director,
        actors: movie.actors,
        image_url: movie.image_url,
        description: movie.description,
        release_date: movie.release_date
          ? new Date(movie.release_date).toISOString().split("T")[0]
          : "",
        status: movie.status,
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Chỉnh sửa thông tin phim
  static async editMovie(req, res) {
    try {
      const {
        name,
        genre,
        director,
        actors,
        description,
        poster,
        release_date,
        status,
      } = req.body;
      const movie = await MovieModel.findByPk(req.params.id);
  
      if (!movie) {
        return res.status(404).json({ error: "Không tìm thấy phim" });
      }
  
      let errors = {};
  
      // Kiểm tra rỗng
      if (!name) errors.name = "Tên phim không được để trống";
      if (!genre) errors.genre = "Thể loại không được để trống";
      if (!director) errors.director = "Đạo diễn không được để trống";
      if (!actors) errors.actors = "Diễn viên không được để trống";
      if (!description) errors.description = "Mô tả không được để trống";
      if (!release_date) errors.release_date = "Ngày phát hành không được để trống";
  
      // Xử lý hình ảnh (poster)
      let finalPoster = poster || movie.image_url; // Nếu không có ảnh mới, giữ nguyên ảnh cũ
  
      if (req.file) {
        console.log("🖼️ File uploaded:", req.file); // Log toàn bộ thông tin file
  
        const mimeType = req.file.mimetype;
        console.log("📄 File MIME Type:", mimeType);
  
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
  
        if (!allowedMimeTypes.includes(mimeType)) {
          errors.poster = "Chỉ được tải lên file hình ảnh (JPG, PNG, GIF, WEBP)";
          console.log("❌ File không hợp lệ:", mimeType);
  
          // Xóa file vừa tải lên nếu không hợp lệ
          fs.unlinkSync(req.file.path);
          console.log("🗑️ Đã xóa file không hợp lệ:", req.file.filename);
        } else {
          finalPoster = req.file.filename; // Lưu ảnh mới
          console.log("✅ Ảnh hợp lệ, lưu với tên:", finalPoster);
  
          // Xóa ảnh cũ nếu có
          if (movie.image_url) {
            const oldImagePath = path.join(__dirname, "../../../public/img/", movie.image_url);
            console.log("🗑️ Kiểm tra ảnh cũ tại:", oldImagePath);
  
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log("✅ Ảnh cũ đã bị xóa:", movie.image_url);
            } else {
              console.log("⚠️ Ảnh cũ không tồn tại:", movie.image_url);
            }
          }
        }
      } else {
        console.log("⚠️ Không có file nào được tải lên.");
      }
  
      // Nếu có lỗi, render lại form
      if (Object.keys(errors).length > 0) {
        return res.render("admin/movie/edit-movie", {
          title: "Sửa Phim",
          movie,
          id: movie.id,
          name,
          genre,
          director,
          actors,
          description,
          release_date,
          status,
          image_url: finalPoster || movie.image_url || "default.jpg",
          errors, // Truyền errors để hiển thị trên giao diện
        });
      }
  
      // Cập nhật phim
      await movie.update({
        name: name || movie.name,
        genre: genre || movie.genre,
        director: director || movie.director,
        actors: actors || movie.actors,
        description: description || movie.description,
        release_date: release_date || movie.release_date,
        status: status || movie.status,
        image_url: finalPoster, // Cập nhật ảnh mới (nếu có)
      });
  
      res.redirect("/admin/movie/list");
    } catch (error) {
      console.error("Lỗi cập nhật phim:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  
  // Xóa sản phẩm
  static async deleteMovie(req, res) {
    try {
      await MovieModel.destroy({ where: { id: req.params.id } });
      res.json({ message: "Xóa phim thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // thêm ngày chiếu phim
  static async getFormMovieDate(req, res) {
    try {
      const movie = await MovieModel.findByPk(req.params.id);

      if (!movie) {
        return res.status(404).json({ error: "Không tìm thấy phim" });
      }

      // Tìm ngày chiếu phim trong bảng MovieDateModel (giả sử bạn có bảng này)
      const movieDate = await MovieDateModel.findOne({
        where: { movie_id: movie.id },
      });

      res.render("admin/movie/add-movie-date", {
        title: "Thêm Ngày Chiếu Phim",
        movie,
        movie_id: movieDate,
        date_show: "",
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addMovieDate(req, res) {
    const { date_show } = req.body;
    const movieId = req.params.id;
    let errors = {};

    // Kiểm tra để trống
    if (!date_show || date_show.trim() === "") {
      errors.date_show = "Vui lòng chọn ngày chiếu.";
    }

    // Chỉ thực hiện kiểm tra ngày nếu `date_show` hợp lệ
    let showDate;
    if (!errors.date_show) {
      showDate = new Date(date_show);
      if (isNaN(showDate.getTime())) {
        // Kiểm tra nếu ngày không hợp lệ
        errors.date_show = "Ngày chiếu không hợp lệ.";
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00 để so sánh chính xác

    if (!errors.date_show && showDate < today) {
      errors.date_show = "Ngày chiếu phải lớn hơn hoặc bằng ngày hiện tại.";
    }

    if (!errors.date_show) {
      const existingDate = await MovieDateModel.findOne({
        where: {
          date_show: showDate,
          movie_id: movieId,
        },
      });

      console.log("Kết quả findOne:", existingDate);
      if (existingDate) {
        errors.date_show = "Ngày chiếu đã tồn tại.";
      }
    }

    try {
      // Nếu có lỗi, trả về trang với thông báo lỗi
      if (Object.keys(errors).length > 0) {
        return res.render("admin/movie/add-movie-date", {
          title: "Thêm ngày chiếu phim",
          movie: { id: movieId },
          errors,
        });
      }

      // Thêm ngày chiếu vào database
      await MovieDateModel.create({ date_show, movie_id: movieId });

      // Chuyển hướng sau khi thêm thành công
      res.redirect(`/admin/movie/date/${movieId}`);
    } catch (error) {
      console.error("Lỗi khi thêm ngày chiếu:", error);
      res.status(500).send("Có lỗi xảy ra.");
    }
  }

  static async getFormShowTime(req, res) {
    try {
      const movie_date = await MovieDateModel.findByPk(req.params.id);

      if (!movie_date) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy ngày chiếu phim" });
      }

      // Tìm ngày chiếu phim trong bảng MovieDateModel (giả sử bạn có bảng này)
      const movieShowtime = await MovieShowtimeModel.findOne({
        where: { movie_date_id: movie_date.id },
      });

      res.render("admin/movie/add-movie-showtime", {
        title: "Thêm Giờ Chiếu Phim",
        movie_date,
        movie_date_id: movieShowtime,
        show_time: "",
        normal_price: "",
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addMovieShowtime(req, res) {
    const { show_time, normal_price } = req.body;
    const movie_date_id = req.params.id;
    let errors = {};

    // Kiểm tra xem movie_date có tồn tại không
    const movie_date = await MovieDateModel.findByPk(movie_date_id);
    if (!movie_date) {
      return res.status(404).json({ error: "Không tìm thấy ngày chiếu phim." });
    }

    // Kiểm tra để trống
    if (!show_time || show_time.trim() === "") {
      errors.show_time = "Vui lòng chọn giờ chiếu.";
    }

    if (!normal_price || normal_price.trim() === "") {
      errors.normal_price = "Vui lòng nhập giá vé.";
    } else if (isNaN(normal_price) || Number(normal_price) < 45000) {
      errors.normal_price = "Giá vé phải là số và lớn hơn bằng 45.000";
    }

    let showTime;
    if (!errors.show_time) {
      showTime = new Date(`1970-01-01T${show_time}:00`);

      if (isNaN(showTime.getTime())) {
        errors.show_time = "Giờ chiếu không hợp lệ.";
      } else {
        const hours = showTime.getHours(); // Lấy giờ từ đối tượng Date

        if (hours < 8 || hours > 23) {
          errors.show_time = "Giờ chiếu phải từ 08:00 đến 23:00.";
        }
      }
    }
    // Nếu có lỗi, trả về trang với thông báo lỗi
    if (Object.keys(errors).length > 0) {
      return res.render("admin/movie/add-movie-showtime", {
        title: "Thêm Giờ Chiếu Phim",
        movie_date,
        movie_date_id,
        show_time: show_time || "",
        normal_price: normal_price || "",
        errors,
      });
    }

    try {
      // Thêm suất chiếu vào database
      await MovieShowtimeModel.create({
        show_time,
        normal_price: Number(normal_price),
        vip_price: Number(normal_price) + 15000,
        movie_date_id,
      });

      // Chuyển hướng sau khi thêm thành công
      res.redirect(`/admin/movie/showtime/${movie_date_id}`);
    } catch (error) {
      console.error("Lỗi khi thêm giờ chiếu:", error);
      res.status(500).send("Có lỗi xảy ra.");
    }
  }

  static async deleteMovieShowtime(req, res) {
    try {
      const movieShowtimeId = req.params.id;
      const movieShowtime = await MovieShowtimeModel.findByPk(movieShowtimeId);

      if (!movieShowtime) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy giờ chiếu phim." });
      }

      await movieShowtime.destroy();

      res.status(200).json({ message: "Xóa giờ chiếu phim thành công." });
    } catch (error) {
      console.error("Lỗi khi xóa giờ chiếu phim:", error);
      res.status(500).send("Có lỗi xảy ra.");
    }
  }
}

module.exports = AdminMovieController;
