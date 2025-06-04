const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { ensureAuthenticated } = require('../middlewares/auth');
const itemController = require('../controllers/itemController');

// 所有路由都需要登录
router.use(ensureAuthenticated);

// 获取所有物品
router.get('/', itemController.getAllItems);

// 按类别查看物品
router.get('/category/:id', itemController.getItemsByCategory);

// 添加物品页面
router.get('/add', itemController.getAddItem);

// 添加物品请求处理
router.post('/add', [
  check('name', '物品名称不能为空').notEmpty()
], itemController.postAddItem);

// 编辑物品页面
router.get('/edit/:id', itemController.getEditItem);

// 更新物品请求处理
router.put('/edit/:id', [
  check('name', '物品名称不能为空').notEmpty()
], itemController.updateItem);

// 删除物品请求处理
router.delete('/delete/:id', itemController.deleteItem);

// 搜索物品
router.get('/search', itemController.searchItems);

module.exports = router;