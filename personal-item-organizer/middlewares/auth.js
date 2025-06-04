// 认证中间件
module.exports = {
  // 确保用户已登录
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', '请先登录才能访问此页面');
    res.redirect('/users/login');
  },
  
  // 确保用户未登录（用于登录/注册页面）
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  }
};