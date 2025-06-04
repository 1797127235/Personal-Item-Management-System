const db = require('../config/db');

class Category {
  // 获取所有类别
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM Category ORDER BY category_name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 根据ID获取类别
  static async findById(categoryId) {
    try {
      const [rows] = await db.query('SELECT * FROM Category WHERE category_id = ?', [categoryId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 创建新类别
  static async create(categoryName) {
    try {
      const [result] = await db.query(
        'INSERT INTO Category (category_name) VALUES (?)',
        [categoryName]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // 更新类别
  static async update(categoryId, categoryName) {
    try {
      const [result] = await db.query(
        'UPDATE Category SET category_name = ? WHERE category_id = ?',
        [categoryName, categoryId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除类别
  static async delete(categoryId) {
    try {
      const [result] = await db.query(
        'DELETE FROM Category WHERE category_id = ?',
        [categoryId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 检查类别是否被使用
  static async isInUse(categoryId) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM Items WHERE category_id = ?',
        [categoryId]
      );
      
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category;