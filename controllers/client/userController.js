const e = require("express");
const UserModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Order = require("../../models/orderModel");
const { Op } = require("sequelize");
const MovieShowtime = require("../../models/movieShowtimeModel");
const Concert = require("../../models/concertModel");
const Tour = require("../../models/tourModel");
const Movie = require("../../models/movieModel");
const MovieDate = require("../../models/movieDateModel");

class UserController {
  static async loginUser(req, res) {
    try {
      res.render("client/user/login", { title: "Login", errors: {} });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xử lý đăng nhập
  static async postLoginUser(req, res) {
    try {
      const { email, password } = req.body;
      let errors = {};

      // Kiểm tra nếu email hoặc mật khẩu rỗng
      if (!email) errors.email = "Vui lòng nhập email!";
      if (!password) errors.password = "Vui lòng nhập mật khẩu!";

      // Nếu có lỗi, render lại trang login
      if (Object.keys(errors).length > 0) {
        return res.render("client/user/login", { title: "Login", errors });
      }

      // Kiểm tra email có tồn tại trong database không
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        errors.email = "Email không tồn tại!";
        return res.render("client/user/login", { title: "Login", errors });
      }

      // Kiểm tra trạng thái tài khoản
      if (user.status === 2) {
        errors.email = "Tài khoản của bạn đã bị khóa!";
        return res.render("client/user/login", { title: "Login", errors });
      }

      // Kiểm tra mật khẩu có đúng không
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.password = "Mật khẩu không đúng!";
        return res.render("client/user/login", { title: "Login", errors });
      }

      // Lưu thông tin user vào session
      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      };

      // Chuyển hướng về trang chủ hoặc dashboard
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAccount(req, res) {
    try {
      res.status(200).render("client/user/account", {
        title: "Account",
        message: req.session.message || null,
        error: req.session.error || null,
      });

      // Xóa thông báo sau khi hiển thị
      delete req.session.message;
      delete req.session.error;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xử lý đăng xuất
  static logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.redirect("/login");
    });
  }

  static async registerUser(req, res) {
    try {
      res.status(200).render("client/user/register", {
        title: "Đăng Ký",
        formData: {},
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xử lý đăng ký tài khoản
  static async postRegisterUser(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      let errors = {};

      // Kiểm tra dữ liệu nhập vào
      if (!username) errors.username = "Họ tên không được để trống!";
      if (!email) errors.email = "Email không được để trống!";
      if (!password) errors.password = "Mật khẩu không được để trống!";
      if (password !== confirmPassword)
        errors.confirmPassword = "Mật khẩu xác nhận không đúng!";

      // Kiểm tra đ��nh dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        errors.email = "Email không hợp lệ!";
      }

      // Nếu có lỗi, render lại trang đăng ký
      if (Object.keys(errors).length > 0) {
        return res.render("client/user/register", {
          title: "Đăng Ký",
          formData: req.body,
          errors,
        });
      }

      // Kiểm tra email đã tồn tại trong database chưa
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        errors.email = "Email đã tồn tại!";
        return res.render("client/user/register", {
          title: "Đăng Ký",
          formData: req.body,
          errors,
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Lưu thông tin người dùng vào database
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role: 2,
        status: 1,
      });

      // Gửi thông báo đăng ký thành công
      req.session.message = "Đăng ký tài khoản thành công!";
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePassword(req, res) {
    try {
      res.status(200).render("client/user/update-password", {
        title: "Update Password",
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async postUpdatePassword(req, res) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      let errors = {};

      // Kiểm tra dữ liệu nhập vào
      if (!oldPassword) errors.oldPassword = "Mật khẩu cũ không được để trống!";
      if (!newPassword)
        errors.newPassword = "Mật khẩu mới không được để trống!";
      if (!confirmPassword)
        errors.confirmPassword = "Mật khẩu xác nhận không được để trống!";
      if (newPassword !== confirmPassword)
        errors.confirmPassword = "Mật khẩu xác nhận không đúng!";

      // Nếu có lỗi, render lại trang đổi mật khẩu
      if (Object.keys(errors).length > 0) {
        return res.render("client/user/update-password", {
          title: "Update Password",
          errors,
        });
      }

      // Kiểm tra mật khẩu cũ có đúng không
      const user = await UserModel.findByPk(req.session.user.id);
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        errors.oldPassword = "Mật khẩu cũ không đúng!";
        return res.render("client/user/update-password", {
          title: "Update Password",
          errors,
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới vào database
      await UserModel.update(
        { password: hashedPassword },
        { where: { id: req.session.user.id } }
      );

      // Gửi thông báo đổi mật khẩu thành công
      req.session.message = "Đổi mật khẩu thành công!";
      res.redirect("/account");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getForgotPassword(req, res) {
    try {
      res.status(200).render("client/user/forgot-password", {
        title: "Forgot Password",
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //   static async postForgotPassword(req, res) {
  //     try {
  //       const { email } = req.body;
  //       let errors = {};

  //       // Kiểm tra dữ liệu nhập vào
  //       if (!email) errors.email = "Email không được để trống!";

  //       // Nếu có lỗi, render lại trang quên mật khẩu
  //       if (Object.keys(errors).length > 0) {
  //         return res.render("client/user/forgot-password", {
  //           title: "Forgot Password",
  //           errors,
  //         });
  //       }

  //       // Kiểm tra email có tồn tại trong database không
  //       const user = await UserModel.findOne({ where: { email } });
  //       if (!user) {
  //         errors.email = "Email không tồn tại!";
  //         return res.render("client/user/forgot-password", {
  //           title: "Forgot Password",
  //           errors,
  //         });
  //       }

  //       // Gửi thông báo khôi phục mật khẩu thành công
  //       req.session.message = "Kiểm tra email để khôi phục mật khẩu!";
  //       res.redirect("/login");
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }

  static async postForgotPassword(req, res) {
    try {
      const { email } = req.body;
      let errors = {};

      // Kiểm tra email nhập vào
      if (!email) errors.email = "Email không được để trống!";

      if (Object.keys(errors).length > 0) {
        return res.render("client/user/forgot-password", {
          title: "Forgot Password",
          errors,
        });
      }

      // Kiểm tra email trong database
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        errors.email = "Email không tồn tại!";
        return res.render("client/user/forgot-password", {
          title: "Forgot Password",
          errors,
        });
      }

      // Tạo token reset mật khẩu (random)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

      // Cấu hình NodeMailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "minhncpc05371@fpt.edu.vn",
          pass: "yqqu aill rsvx gxir", // Sử dụng App Password nếu dùng Gmail
        },
      });

      // Nội dung email
      const mailOptions = {
        from: '"Support Team" <minhncpc05371@fpt.edu.vn>',
        to: email,
        subject: "Khôi phục mật khẩu",
        html: `<p>Xin chào,</p>
              <p>Bạn đã yêu cầu khôi phục mật khẩu. Nhấp vào link bên dưới để đặt lại mật khẩu:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>`,
      };

      // Gửi email
      await transporter.sendMail(mailOptions);

      // Hiển thị thông báo thành công
      req.session.message = "Kiểm tra email để khôi phục mật khẩu!";
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResetPassword(req, res) {
    try {
      const { token } = req.params;
      res.render("client/user/reset-password", {
        title: "Reset Password",
        token,
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async postResetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;
      let errors = {};

      // Kiểm tra dữ liệu nhập vào
      if (!newPassword) errors.newPassword = "Mật khẩu không được để trống!";
      if (newPassword !== confirmPassword)
        errors.confirmPassword = "Mật khẩu xác nhận không đúng!";

      // Nếu có lỗi, render lại trang đặt lại mật khẩu
      if (Object.keys(errors).length > 0) {
        return res.render("client/user/reset-password", {
          title: "Reset Password",
          token,
          errors,
        });
      }

      // Kiểm tra token có hợp lệ không
      if (!token) {
        req.session.error = "Token không hợp lệ!";
        return res.redirect("/login");
      }

      // Kiểm tra token có tồn tại trong database không
      const user = await UserModel.findOne({ where: { resetToken: token } });
      if (!user) {
        req.session.error = "Token không hợp lệ!";
        return res.redirect("/login");
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới vào database
      await UserModel.update(
        { password: hashedPassword, resetToken: null },
        { where: { resetToken: token } }
      );

      // Gửi thông báo đổi mật khẩu thành công
      req.session.message = "Đổi mật khẩu thành công!";
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getMyTickets(req, res) {
    try {
      const userId = req.session.user.id; // Lấy ID người dùng từ session

      // Lấy danh sách vé phim
      const movieTickets = await Order.findAll({
        where: {
          user_id: userId,
          movie_showtimes_id: { [Op.ne]: null },
        },
        include: [
          {
            model: MovieShowtime,
            as: "movie_showtimes", // Đảm bảo alias này trùng với Order.belongsTo(MovieShowtime)
            include: [
              {
                model: MovieDate,
                as: "movie_date", // Đảm bảo alias này trùng với MovieShowtime.belongsTo(MovieDate)
                include: [
                  {
                    model: Movie,
                    as: "movie", // Đảm bảo alias này trùng với MovieDate.belongsTo(Movie)
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Lấy danh sách vé concert
      const concertTickets = await Order.findAll({
        where: { user_id: userId, concert_id: { [Op.ne]: null } },
        include: [{ model: Concert }],
        order: [["createdAt", "DESC"]],
      });

      // Lấy danh sách vé tour
      const tourTickets = await Order.findAll({
        where: { user_id: userId, tour_id: { [Op.ne]: null } },
        include: [{ model: Tour }],
        order: [["createdAt", "DESC"]],
      });

      // Render ra trang `my-tickets.ejs`
      res.render("client/user/my-tickets", {
        title: "Vé của bạn",
        user: req.session.user,
        movieTickets,
        concertTickets,
        tourTickets,
      });
    } catch (error) {
      console.error("Lỗi khi tải vé của bạn:", error);
      res.status(500).send("Lỗi khi tải vé của bạn.");
    }
  }
}

module.exports = UserController;
