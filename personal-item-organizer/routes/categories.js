const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { ensureAuthenticated } = require('../middlewares/auth');
const categoryController = require('../controllers/categoryController');

// 所有路由都需要登录
router.use(ensureAuthenticated);

// 获取所有类别
router.get('/', categoryController.getAllCategories);

// 添加类别页面
router.get('/add', categoryController.getAddCategory);

// 添加类别请求处理
router.post('/add', [
  check('category_name', '类别名称不能为空').notEmpty()
], categoryController.postAddCategory);

// 编辑类别页面
router.get('/edit/:id', categoryController.getEditCategory);

// 更新类别请求处理
router.put('/edit/:id', [
  check('category_name', '类别名称不能为空').notEmpty()
], categoryController.updateCategory);

// 删除类别请求处理
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;