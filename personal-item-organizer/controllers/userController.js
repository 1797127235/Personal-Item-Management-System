const User = require('../models/User');
const passport = require('passport');
const { validationResult } = require('express-validator');

// 显示注册页面
exports.getRegister = (req, res) => {
  res.render('users/register', {
    title: '注册'
  });
};

// 处理注册请求
exports.postRegister = async (req, res) => {
  const { username, email, password, password2 } = req.body;
  const errors = validationResult(req);

  // 表单验证
  if (!errors.isEmpty()) {
    return res.render('users/register', {
      title: '注册',
      errors: errors.array(),
      username,
      email
    });
  }

  try {
    // 检查邮箱是否已注册
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.render('users/register', {
        title: '注册',
        errors: [{ msg: '该邮箱已被注册' }],
        username,
        email
      });
    }

    // 创建用户
    await User.create({
      username,
      email,
      password
    });

    req.flash('success_msg', '注册成功，现在可以登录了');
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '注册过程中出现错误');
    res.redirect('/users/register');
  }
};

// 显示登录页面
exports.getLogin = (req, res) => {
  res.render('users/login', {
    title: '登录'
  });
};

// 处理登录请求
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

// 处理注销请求
exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) { 
      console.error(err);
      return next(err); 
    }
    req.flash('success_msg', '已成功注销');
    res.redirect('/users/login');
  });
};

// 显示个人资料页面
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    
    res.render('users/profile', {
      title: '个人资料',
      user
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '获取个人资料时出现错误');
    res.redirect('/dashboard');
  }
};

// 处理更新个人资料请求
exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('users/profile', {
      title: '个人资料',
      user: req.user,
      errors: errors.array()
    });
  }

  try {
    // 检查邮箱是否已被其他用户使用
    const existingUser = await User.findByEmail(email);
    
    if (existingUser && existingUser.user_id !== req.user.user_id) {
      return res.render('users/profile', {
        title: '个人资料',
        user: req.user,
        errors: [{ msg: '该邮箱已被其他用户使用' }]
      });
    }

    // 更新用户资料
    const updated = await User.update(req.user.user_id, { username, email });
    
    if (updated) {
      req.flash('success_msg', '个人资料已更新');
    } else {
      req.flash('error_msg', '更新个人资料失败');
    }
    
    res.redirect('/users/profile');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '更新个人资料时出现错误');
    res.redirect('/users/profile');
  }
};

// 显示更改密码页面
exports.getChangePassword = (req, res) => {
  res.render('users/change-password', {
    title: '更改密码'
  });
};

// 处理更改密码请求
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('users/change-password', {
      title: '更改密码',
      errors: errors.array()
    });
  }

  try {
    // 验证当前密码
    const isMatch = await User.verifyPassword(currentPassword, req.user.password_hash);
    
    if (!isMatch) {
      return res.render('users/change-password', {
        title: '更改密码',
        errors: [{ msg: '当前密码不正确' }]
      });
    }

    // 更新密码
    const updated = await User.updatePassword(req.user.user_id, newPassword);
    
    if (updated) {
      req.flash('success_msg', '密码已更新，请重新登录');
      req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users/login');
      });
    } else {
      req.flash('error_msg', '更新密码失败');
      res.redirect('/users/change-password');
    }
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '更改密码时出现错误');
    res.redirect('/users/change-password');
  }
};