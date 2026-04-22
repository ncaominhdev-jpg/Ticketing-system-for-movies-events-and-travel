const e = require("express");
const ConcertModel = require("../../models/concertModel");
const artistImageModel = require("../../models/artistImageModel");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

class AdminConcertController {
  static async getAllConcerts(req, res) {
    try {
      const concerts = await ConcertModel.findAll();
      res
        .status(200)
        .render("admin/concert/list", { title: "List Concert", concerts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFormAddConcert(req, res) {
    res.render("admin/concert/add", {
      title: "Thêm Sự Kiện",
      errors: {}, // Đảm bảo không bị undefined
      formData: {},
      name: "",
      event_date: "",
      start_time: "",
      location: "",
      description: "",
      image_url: "",
      vip_price: "",
      normal_price: "",
    });
  }

  static async addConcert(req, res) {
    try {
      const {
        name,
        event_date,
        start_time,
        location,
        description,
        vip_price,
        normal_price,
      } = req.body;
      let errors = {};
      let image_url = req.file ? req.file.filename : "";

      // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Kiểm tra lỗi đầu vào
      if (!name) errors.name = "Tên sự kiện không được để trống";
      if (!event_date) {
        errors.event_date = "Ngày diễn ra không được để trống";
      } else if (event_date <= today) {
        errors.event_date = "Ngày diễn ra phải lớn hơn ngày hiện tại";
      }
      if (!start_time) errors.start_time = "Giờ diễn ra không được để trống";
      if (!location) errors.location = "Địa điểm không được để trống";
      if (!description) errors.description = "Mô tả không được để trống";
      if (!vip_price || isNaN(vip_price) || vip_price <= 0)
        errors.vip_price = "Giá vé VIP không hợp lệ";
      if (!normal_price || isNaN(normal_price) || normal_price <= 0)
        errors.normal_price = "Giá vé thường không hợp lệ";

      // Kiểm tra hình ảnh
      if (!image_url || image_url.trim() === "") {
        errors.image_url = "Hình ảnh không được để trống.";
      } else {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const fileExtension = path.extname(image_url).toLowerCase(); // Lấy đuôi file
        if (!imageExtensions.includes(fileExtension)) {
          errors.image_url =
            "Hình ảnh phải có định dạng .jpg, .jpeg, .png, .gif hoặc .webp.";
        }
      }

      // Kiểm tra nếu có lỗi, trả về form với thông báo lỗi
      if (Object.keys(errors).length > 0) {
        return res.render("admin/concert/add", {
          title: "Thêm Sự Kiện",
          errors,
          formData: {
            name,
            event_date,
            start_time,
            location,
            description,
            vip_price,
            normal_price,
            image_url,
          },
        });
      }

      // Nếu không có lỗi, lưu sự kiện vào database
      const newConcert = {
        name,
        event_date,
        start_time,
        location,
        description,
        vip_price,
        normal_price,
        image_url,
      };

      // Gọi model hoặc database để lưu (giả sử có `ConcertModel.create()`)
      await ConcertModel.create(newConcert);

      // Chuyển hướng về trang danh sách sự kiện
      res.redirect("/admin/concert/list");
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }

  static async getFormEditConcert(req, res) {
    try {
      const concert = await ConcertModel.findByPk(req.params.id);

      if (!concert) {
        return res.status(404).send("Sự kiện không tồn tại");
      }

      res.render("admin/concert/edit", {
        title: "Chỉnh Sửa Sự Kiện",
        errors: {},
        concert,
        id: concert.id,
        name: concert.name,
        event_date: concert.event_date,
        start_time: concert.start_time,
        location: concert.location,
        description: concert.description,
        vip_price: concert.vip_price,
        normal_price: concert.normal_price,
        image_url: concert.image_url,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
      res.status(500).send("Lỗi server");
    }
  }

  // Hiển thị form chỉnh sửa sự kiện
  static async getFormEditConcert(req, res) {
    try {
      const concert = await ConcertModel.findByPk(req.params.id);

      if (!concert) {
        return res.status(404).send("Sự kiện không tồn tại.");
      }

      res.render("admin/concert/edit", {
        title: "Chỉnh Sửa Sự Kiện",
        errors: {},
        concert,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
      res.status(500).send("Lỗi server.");
    }
  }
  static async updateConcert(req, res) {
    try {
      let {
        name,
        event_date,
        start_time,
        location,
        description,
        vip_price,
        normal_price,
        poster,
      } = req.body;

      const concertId = req.params.id; // Khai báo concertId
      const concert = await ConcertModel.findByPk(concertId);

      if (!concert) {
        return res.status(404).send("Sự kiện không tồn tại.");
      }

      let errors = {}; // Danh sách lỗi

      // Kiểm tra dữ liệu nhập vào
      if (!name || name.trim() === "")
        errors.name = "Tên sự kiện không được để trống.";
      if (!event_date) {
        errors.event_date = "Ngày diễn ra sự kiện không được để trống.";
      } else if (new Date(event_date) <= new Date()) {
        errors.event_date = "Ngày diễn ra sự kiện phải lớn hơn ngày hiện tại.";
      }
      if (!start_time || start_time.trim() === "")
        errors.start_time = "Thời gian bắt đầu không được để trống.";
      if (!location || location.trim() === "")
        errors.location = "Địa điểm không được để trống.";
      if (!description || description.trim() === "")
        errors.description = "Mô tả không được để trống.";
      if (!vip_price || isNaN(vip_price) || vip_price <= 0)
        errors.vip_price = "Giá VIP phải là số dương.";
      if (!normal_price || isNaN(normal_price) || normal_price <= 0)
        errors.normal_price = "Giá thường phải là số dương.";

      // Giữ ảnh cũ nếu không upload ảnh mới
      let finalPoster = poster || concert.image_url;

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
          errors.poster =
            "Chỉ được tải lên file hình ảnh (JPG, PNG, GIF, WEBP)";
          console.log("❌ File không hợp lệ:", mimeType);

          // Xóa file vừa tải lên nếu không hợp lệ
          fs.unlinkSync(req.file.path);
          console.log("🗑️ Đã xóa file không hợp lệ:", req.file.filename);
        } else {
          finalPoster = req.file.filename; // Lưu ảnh mới
          console.log("✅ Ảnh hợp lệ, lưu với tên:", finalPoster);

          // Xóa ảnh cũ nếu có
          if (concert.image_url) {
            const oldImagePath = path.join(
              __dirname,
              "../../../public/img/",
              concert.image_url
            );
            console.log("🗑️ Kiểm tra ảnh cũ tại:", oldImagePath);

            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log("✅ Ảnh cũ đã bị xóa:", concert.image_url);
            } else {
              console.log("⚠️ Ảnh cũ không tồn tại:", concert.image_url);
            }
          }
        }
      } else {
        console.log("⚠️ Không có file nào được tải lên.");
      }

      // Nếu có lỗi, render lại trang chỉnh sửa hoặc trả về JSON lỗi
      if (Object.keys(errors).length > 0) {
        return res.render("admin/concert/edit", {
          title: "Chỉnh Sửa Sự Kiện",
          errors,
          concert: {
            id: concertId,
            name,
            event_date,
            start_time,
            location,
            description,
            vip_price,
            normal_price,
            poster: finalPoster,
          },
        });
      }

      // Cập nhật sự kiện
      await ConcertModel.update(
        {
          name,
          event_date,
          start_time,
          location,
          description,
          vip_price,
          normal_price,
          image_url: finalPoster, // Đúng biến dữ liệu hình ảnh
        },
        { where: { id: concertId } }
      );

      res.redirect("/admin/concert/list");
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      res.status(500).send("Lỗi server.");
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
      res.status(200).render("admin/concert/details", {
        title: concert.name,
        concert,
        artistImages,
      });
    } catch (error) {
      console.error("Error fetching concert details:", error);
      res
        .status(500)
        .render("admin/concert/error", { title: "Lỗi Server", error: "" });
    }
  }

  static async getFormAddArtistImage(req, res) {
    try {
      const concert = await ConcertModel.findByPk(req.params.id);

      if (!concert) {
        return res.status(404).json({ error: "Không tìm thấy phim" });
      }

      // Tìm ngày chiếu phim trong bảng concertDateModel (giả sử bạn có bảng này)
      const artistImage = await artistImageModel.findOne({
        where: { concert_id: concert.id },
      });

      res.render("admin/concert/add-artist", {
        title: "Thêm Nghệ Sĩ",
        concert,
        concert_id: artistImage,
        artist_name: "",
        image_url: "",
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addArtistImage(req, res) {
    try {
      const { artist_name } = req.body;
      const concert_id = req.params.id;
      const imageFile = req.file; // Lấy file hình ảnh từ multer

      let errors = {};

      // Kiểm tra concert có tồn tại không
      const concert = await ConcertModel.findByPk(concert_id);
      if (!concert) {
        return res.status(404).json({ error: "Không tìm thấy concert" });
      }

      // 1️⃣ Bắt lỗi nếu để trống tên nghệ sĩ
      if (!artist_name) {
        errors.artist_name = "Tên nghệ sĩ không được để trống";
      }

      // 2️⃣ Bắt lỗi nếu không có file ảnh
      if (!imageFile) {
        errors.image_url = "Vui lòng chọn hình ảnh";
      } else {
        // Lấy phần mở rộng của file (đuôi file)
        const fileExtension = imageFile.originalname
          .split(".")
          .pop()
          .toLowerCase();
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

        // 3️⃣ Kiểm tra đuôi file có hợp lệ không
        if (!allowedExtensions.includes(fileExtension)) {
          errors.image_url =
            "Chỉ chấp nhận file ảnh có đuôi JPG, JPEG, PNG, GIF, BMP, WEBP";
        }

        // 4️⃣ Kiểm tra kích thước file (giới hạn 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (imageFile.size > maxSize) {
          errors.image_url = "Dung lượng file không được vượt quá 2MB";
        }
      }

      // 5️⃣ Kiểm tra nghệ sĩ đã tồn tại trong concert chưa
      const existingArtist = await artistImageModel.findOne({
        where: { concert_id, artist_name },
      });

      if (existingArtist) {
        errors.artist_name = "Nghệ sĩ này đã tồn tại trong sự kiện";
      }

      // Nếu có lỗi, render lại form với dữ liệu đã nhập
      if (Object.keys(errors).length > 0) {
        return res.render("admin/concert/add-artist", {
          title: "Thêm Nghệ Sĩ",
          concert,
          concert_id,
          artist_name, // Giữ lại giá trị đã nhập
          image_url: imageFile ? imageFile.filename : "", // Nếu có ảnh, giữ lại tên file
          errors,
        });
      }

      // Lưu nghệ sĩ mới vào database
      await artistImageModel.create({
        concert_id,
        artist_name,
        image_url: imageFile.filename, // Lưu tên file ảnh
      });

      res.redirect(`/admin/concert/details/${concert_id}`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Hiển thị form chỉnh sửa nghệ sĩ
  static async getFormEditArtist(req, res) {
    try {
      const artist = await artistImageModel.findByPk(req.params.id);

      if (!artist) {
        return res.status(404).json({ error: "Không tìm thấy nghệ sĩ" });
      }

      // Tìm Concert dựa trên artist.concert_id
      const concert = await ConcertModel.findByPk(artist.concert_id);

      res.render("admin/concert/edit-artist", {
        title: "Chỉnh Sửa Nghệ Sĩ",
        concert, // Truyền concert đúng với ID lấy từ artist
        artist,
        errors: {},
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Chỉnh sửa thông tin nghệ sĩ
  static async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const { artist_name } = req.body;
      const image = req.file; // Ảnh mới (nếu có)
      let errors = {};

      // 1. Lấy thông tin nghệ sĩ hiện tại
      const artist = await artistImageModel.findByPk(id);
      if (!artist) {
        return res.status(404).json({ error: "Không tìm thấy nghệ sĩ" });
      }

      // 2. Kiểm tra trùng tên nghệ sĩ trong cùng concert_id
      const existingArtist = await artistImageModel.findOne({
        where: {
          artist_name: artist_name.trim(),
          concert_id: artist.concert_id,
          id: { [Op.ne]: id }, // Loại trừ chính nó
        },
      });

      if (existingArtist) {
        errors.artist_name = "Tên nghệ sĩ đã tồn tại trong concert này.";
      }

      // 3. Kiểm tra tên nghệ sĩ không được rỗng
      if (!artist_name || artist_name.trim() === "") {
        errors.artist_name = "Tên nghệ sĩ không được để trống.";
      }

      // 4. Kiểm tra định dạng ảnh (nếu có upload)
      if (image) {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const ext = path.extname(image.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          errors.image = "Chỉ chấp nhận các file .jpg, .jpeg, .png, .gif.";
        }
      }

      // 5. Nếu có lỗi, trả về form với lỗi
      if (Object.keys(errors).length > 0) {
        return res.render("admin/concert/edit-artist", {
          title: "Chỉnh Sửa Nghệ Sĩ",
          concert: artist.concert_id,
          artist,
          errors,
        });
      }

      // 6. Cập nhật dữ liệu
      artist.artist_name = artist_name;
      if (image) {
        artist.image_url = image.filename; // Cập nhật ảnh nếu có
      }
      await artist.save();

      // 7. Chuyển hướng sau khi cập nhật
      res.redirect(`/admin/concert/details/${artist.concert_id}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminConcertController;
