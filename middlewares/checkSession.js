module.exports = function checkSession(req, res, next) {
    if (!req.session.user) {
      return res.redirect("/login"); // Chưa đăng nhập → về trang login
    }
  
    const sessionStartTime = new Date(req.session.user.loginTime);
    const now = new Date();
    const sessionDuration = 60 * 60 * 1000; // 1 giờ (60 phút * 60 giây * 1000 ms)
  
    if (now - sessionStartTime > sessionDuration) {
      req.session.destroy(() => {
        return res.redirect("/login"); // Hết hạn → bắt đăng nhập lại
      });
    } else {
      next(); // Session còn hiệu lực → tiếp tục
    }
  };
  