const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// 显示所有类别
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    res.render('categories/index', {
      title: '物品类别管理',
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '获取类别列表时出现错误');
    res.redirect('/dashboard');
  }
};

// 显示添加类别页面
exports.getAddCategory = (req, res) => {
  res.render('categories/add', {
    title: '添加新类别'
  });
};

// 处理添加类别请求
exports.postAddCategory = async (req, res) => {
  const { category_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('categories/add', {
      title: '添加新类别',
      errors: errors.array(),
      category_name
    });
  }

  try {
    // 创建新类别
    await Category.create(category_name);

    req.flash('success_msg', '类别添加成功');
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '添加类别时出现错误');
    res.redirect('/categories/add');
  }
};

// 显示编辑类别页面
exports.getEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      req.flash('error_msg', '类别不存在');
      return res.redirect('/categories');
    }
    
    res.render('categories/edit', {
      title: '编辑类别',
      category
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '加载编辑类别页面时出现错误');
    res.redirect('/categories');
  }
};

// 处理更新类别请求
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { category_name } = req.body;
  const errors = validationResult(req);

  try {
    // 检查类别是否存在
    const existingCategory = await Category.findById(categoryId);
    
    if (!existingCategory) {
      req.flash('error_msg', '类别不存在');
      return res.redirect('/categories');
    }
    
    if (!errors.isEmpty()) {
      return res.render('categories/edit', {
        title: '编辑类别',
        category: {
          ...existingCategory,
          category_name
        },
        errors: errors.array()
      });
    }

    // 更新类别
    const updated = await Category.update(categoryId, category_name);
    
    if (updated) {
      req.flash('success_msg', '类别已更新');
    } else {
      req.flash('error_msg', '更新类别失败');
    }
    
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '更新类别时出现错误');
    res.redirect(`/categories/edit/${categoryId}`);
  }
};

// 处理删除类别请求
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // 检查类别是否存在
    const existingCategory = await Category.findById(categoryId);
    
    if (!existingCategory) {
      req.flash('error_msg', '类别不存在');
      return res.redirect('/categories');
    }
    
    // 检查类别是否被使用
    const isInUse = await Category.isInUse(categoryId);
    
    if (isInUse) {
      req.flash('error_msg', '该类别下有物品，无法删除');
      return res.redirect('/categories');
    }
    
    // 删除类别
    const deleted = await Category.delete(categoryId);
    
    if (deleted) {
      req.flash('success_msg', '类别已删除');
    } else {
      req.flash('error_msg', '删除类别失败');
    }
    
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', '删除类别时出现错误');
    res.redirect('/categories');
  }
};