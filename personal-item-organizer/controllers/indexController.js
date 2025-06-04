const Item = require('../models/Item');
const Category = require('../models/Category');

// 显示首页
exports.getIndex = (req, res) => {
  res.render('index', {
    title: '个人物品管理系统'
  });
};

// 显示仪表盘
exports.getDashboard = async (req, res) => {
  try {
    // 获取用户的所有物品
    const items = await Item.findAllByUser(req.user.user_id);
    
    // 获取所有类别
    const categories = await Category.findAll();
    
    // 每个类别的物品数量统计
    const categoryStats = [];
    const categoryMap = new Map();
    
    // 初始化类别映射
    categories.forEach(category => {
      categoryMap.set(category.category_id, { 
        name: category.category_name, 
        count: 0 
      });
    });
    
    // 统计各类别物品数量
    items.forEach(item => {
      if (item.category_id && categoryMap.has(item.category_id)) {
        const category = categoryMap.get(item.category_id);
        category.count++;
      }
    });
    
    // 转换为数组
    categoryMap.forEach((value) => {
      if (value.count > 0) {
        categoryStats.push(value);
      }
    });
    
    // 最近添加的物品（最多5个）
    const recentItems = items.slice(0, 5);
    
    res.render('dashboard', {
      title: '仪表盘',
      totalItems: items.length,
      totalCategories: categories.length,
      categoryStats,
      recentItems
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '加载仪表盘时出现错误');
    res.render('dashboard', {
      title: '仪表盘',
      totalItems: 0,
      totalCategories: 0,
      categoryStats: [],
      recentItems: []
    });
  }
};