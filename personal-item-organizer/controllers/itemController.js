const Item = require('../models/Item');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// 显示用户的所有物品
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAllByUser(req.user.user_id);
    const categories = await Category.findAll();
    
    res.render('items/index', {
      title: '我的物品',
      items,
      categories,
      activeCategory: null
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '获取物品列表时出现错误');
    res.redirect('/dashboard');
  }
};

// 显示按类别筛选的物品
exports.getItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const items = await Item.findByCategory(categoryId, req.user.user_id);
    const categories = await Category.findAll();
    const activeCategory = await Category.findById(categoryId);
    
    res.render('items/index', {
      title: `类别: ${activeCategory ? activeCategory.category_name : '未知'}`,
      items,
      categories,
      activeCategory: categoryId
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '获取物品列表时出现错误');
    res.redirect('/items');
  }
};

// 显示添加物品页面
exports.getAddItem = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    res.render('items/add', {
      title: '添加新物品',
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '加载添加物品页面时出现错误');
    res.redirect('/items');
  }
};

// 处理添加物品请求
exports.postAddItem = async (req, res) => {
  const { name, description, location, category_id } = req.body;
  const errors = validationResult(req);

  try {
    const categories = await Category.findAll();
    
    if (!errors.isEmpty()) {
      return res.render('items/add', {
        title: '添加新物品',
        categories,
        errors: errors.array(),
        item: {
          name,
          description,
          location,
          category_id
        }
      });
    }

    // 创建新物品
    await Item.create({
      user_id: req.user.user_id,
      name,
      description,
      location,
      category_id: category_id || null
    });

    req.flash('success_msg', '物品添加成功');
    res.redirect('/items');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '添加物品时出现错误');
    res.redirect('/items/add');
  }
};

// 显示编辑物品页面
exports.getEditItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId, req.user.user_id);
    
    if (!item) {
      req.flash('error_msg', '物品不存在或不属于您');
      return res.redirect('/items');
    }
    
    const categories = await Category.findAll();
    
    res.render('items/edit', {
      title: '编辑物品',
      item,
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '加载编辑物品页面时出现错误');
    res.redirect('/items');
  }
};

// 处理更新物品请求
exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const { name, description, location, category_id } = req.body;
  const errors = validationResult(req);

  try {
    // 检查物品是否存在且属于当前用户
    const existingItem = await Item.findById(itemId, req.user.user_id);
    
    if (!existingItem) {
      req.flash('error_msg', '物品不存在或不属于您');
      return res.redirect('/items');
    }
    
    const categories = await Category.findAll();
    
    if (!errors.isEmpty()) {
      return res.render('items/edit', {
        title: '编辑物品',
        item: {
          ...existingItem,
          name,
          description,
          location,
          category_id
        },
        categories,
        errors: errors.array()
      });
    }

    // 更新物品
    const updated = await Item.update(itemId, req.user.user_id, {
      name,
      description,
      location,
      category_id: category_id || null
    });
    
    if (updated) {
      req.flash('success_msg', '物品已更新');
    } else {
      req.flash('error_msg', '更新物品失败');
    }
    
    res.redirect('/items');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '更新物品时出现错误');
    res.redirect(`/items/edit/${itemId}`);
  }
};

// 处理删除物品请求
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // 检查物品是否存在且属于当前用户
    const existingItem = await Item.findById(itemId, req.user.user_id);
    
    if (!existingItem) {
      req.flash('error_msg', '物品不存在或不属于您');
      return res.redirect('/items');
    }
    
    // 删除物品
    const deleted = await Item.delete(itemId, req.user.user_id);
    
    if (deleted) {
      req.flash('success_msg', '物品已删除');
    } else {
      req.flash('error_msg', '删除物品失败');
    }
    
    res.redirect('/items');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '删除物品时出现错误');
    res.redirect('/items');
  }
};

// 处理搜索物品请求
exports.searchItems = async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.redirect('/items');
    }
    
    const items = await Item.search(query, req.user.user_id);
    const categories = await Category.findAll();
    
    res.render('items/search-results', {
      title: '搜索结果',
      items,
      categories,
      query
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '搜索物品时出现错误');
    res.redirect('/items');
  }
};