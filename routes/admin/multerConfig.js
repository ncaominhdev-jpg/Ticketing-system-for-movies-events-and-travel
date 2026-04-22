const multer = require("multer");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Cấu hình Multer (KHÔNG kiểm tra MIME type ở đây)
const upload = multer({ storage: storage });

module.exports = upload;
