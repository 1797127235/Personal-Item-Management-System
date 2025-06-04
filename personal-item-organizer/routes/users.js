const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// 注册页面路由 - 公开访问
router.get('/register', forwardAuthenticated, userController.getRegister);

// 注册请求处理路由
router.post('/register', [
  check('username', '用户名不能为空').notEmpty(),
  check('email', '请输入有效的邮箱地址').isEmail(),
  check('password', '密码至少需要6个字符').isLength({ min: 6 }),
  check('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('两次输入的密码不匹配');
    }
    return true;
  })
], userController.postRegister);

// 登录页面路由 - 公开访问
router.get('/login', forwardAuthenticated, userController.getLogin);

// 登录请求处理路由
router.post('/login', userController.postLogin);

// 注销路由
router.get('/logout', userController.logout);

// 个人资料页面路由 - 需要登录
router.get('/profile', ensureAuthenticated, userController.getProfile);

// 更新个人资料请求处理路由
router.post('/profile', ensureAuthenticated, [
  check('username', '用户名不能为空').notEmpty(),
  check('email', '请输入有效的邮箱地址').isEmail()
], userController.updateProfile);

// 更改密码页面路由 - 需要登录
router.get('/change-password', ensureAuthenticated, userController.getChangePassword);

// 更改密码请求处理路由
router.post('/change-password', ensureAuthenticated, [
  check('currentPassword', '当前密码不能为空').notEmpty(),
  check('newPassword', '新密码至少需要6个字符').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('两次输入的新密码不匹配');
    }
    return true;
  })
], userController.changePassword);

module.exports = router;