const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth');
const indexController = require('../controllers/indexController');

// 首页路由 - 公开访问
router.get('/', forwardAuthenticated, indexController.getIndex);

// 仪表盘路由 - 需要登录
router.get('/dashboard', ensureAuthenticated, indexController.getDashboard);

module.exports = router;