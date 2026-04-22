const e = require("express");
const UserModel = require("../../models/userModel");
const bcrypt = require("bcrypt");

class AdminUsertController {
  static async getAllUser(req, res) {
    try {
      const users = await UserModel.findAll({
        attributes: ["id", "username", "email", "status", "role"],
      });

      res.status(200).render("admin/user/list", {
        title: "Danh sách người dùng",
        users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAddUser(req, res) {
    res.render("admin/user/add", {
      title: "Thêm Người Dùng",
      errors: {},
      formData: {},
    });
  }

  // [POST] Xử lý thêm người dùng
  static async postAddUser(req, res) {
    try {
      const { username, email, password, confirm_password, role, status } =
        req.body;
      let errors = {};
      let formData = { username, email, role, status }; // Giữ lại dữ liệu đã nhập

      // 1. Bắt lỗi null (trống)
      if (!username) errors.username = "Họ tên không được để trống!";
      if (!email) errors.email = "Email không được để trống!";
      if (!password) errors.password = "Mật khẩu không được để trống!";
      if (!confirm_password)
        errors["confirm-password"] = "Vui lòng nhập lại mật khẩu!";
      if (!role) errors.role = "Vui lòng chọn vai trò!";
      if (!status) errors.status = "Vui lòng chọn trạng thái!";

      // 2. Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        errors.email = "Email không hợp lệ!";
      }

      // 3. Kiểm tra email đã tồn tại chưa
      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser) {
        errors.email = "Email đã tồn tại!";
      }

      // 4. Kiểm tra mật khẩu có trùng khớp không
      if (password !== confirm_password) {
        errors["confirm-password"] = "Mật khẩu nhập lại không khớp!";
        console.log(password);
        console.log(confirm_password);
      }

      // Nếu có lỗi, trả về form cùng dữ liệu đã nhập
      if (Object.keys(errors).length > 0) {
        return res.render("admin/user/add", {
          title: "Thêm Người Dùng",
          errors,
          formData,
        });
      }

      // 5. Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      //  6. Lưu người dùng mới
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
        status,
      });

      // Chuyển hướng về danh sách người dùng
      res.redirect("/admin/user/list");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Hiển thị form chỉnh sửa
  static async getEditUser(req, res) {
    try {
      const user = await UserModel.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại!");
      }
      res.render("admin/user/edit", {
        title: "Chỉnh Sửa Người Dùng",
        user,
        errors: {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xử lý cập nhật thông tin người dùng
  static async postEditUser(req, res) {
    try {
      const { username, role, status } = req.body;
      let errors = {};

      if (!username) errors.username = "Họ tên không được để trống!";
      if (!role) errors.role = "Vui lòng chọn vai trò!";
      if (!status) errors.status = "Vui lòng chọn trạng thái!";

      const user = await UserModel.findByPk(req.params.id);
      if (!user) return res.status(404).send("Người dùng không tồn tại!");

      if (Object.keys(errors).length > 0) {
        return res.render("admin/user/edit", {
          title: "Chỉnh Sửa Người Dùng",
          user,
          errors,
        });
      }

      // Cập nhật thông tin
      await user.update({ username, role, status });

      res.redirect("/admin/user/list");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // Xóa người dùng
  static async deleteUser(req, res) {
    try {
      const user = await UserModel.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Người dùng không tồn tại!" });
      }

      await user.destroy();

      // Nếu dùng giao diện web, redirect
      req.flash("success", "Xoá người dùng thành công!");
      res.redirect("/admin/user/list");

      // Nếu dùng API, trả về JSON
      // return res.json({ message: "Xoá người dùng thành công!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminUsertController;
