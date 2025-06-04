const db = require('../config/db');

class Item {
  // 获取用户的所有物品
  static async findAllByUser(userId) {
    try {
      const [rows] = await db.query(
        `SELECT i.*, c.category_name 
         FROM Items i 
         LEFT JOIN Category c ON i.category_id = c.category_id
         WHERE i.user_id = ?
         ORDER BY i.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 根据ID获取物品
  static async findById(itemId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT i.*, c.category_name 
         FROM Items i 
         LEFT JOIN Category c ON i.category_id = c.category_id
         WHERE i.item_id = ? AND i.user_id = ?`,
        [itemId, userId]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据类别获取物品
  static async findByCategory(categoryId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT i.*, c.category_name 
         FROM Items i 
         LEFT JOIN Category c ON i.category_id = c.category_id
         WHERE i.category_id = ? AND i.user_id = ?
         ORDER BY i.created_at DESC`,
        [categoryId, userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 创建新物品
  static async create(itemData) {
    try {
      const [result] = await db.query(
        'INSERT INTO Items (user_id, name, description, location, category_id) VALUES (?, ?, ?, ?, ?)',
        [
          itemData.user_id,
          itemData.name,
          itemData.description || null,
          itemData.location || null,
          itemData.category_id || null
        ]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // 更新物品
  static async update(itemId, userId, itemData) {
    try {
      const [result] = await db.query(
        'UPDATE Items SET name = ?, description = ?, location = ?, category_id = ? WHERE item_id = ? AND user_id = ?',
        [
          itemData.name,
          itemData.description || null,
          itemData.location || null,
          itemData.category_id || null,
          itemId,
          userId
        ]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除物品
  static async delete(itemId, userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM Items WHERE item_id = ? AND user_id = ?',
        [itemId, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 搜索物品
  static async search(query, userId) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.query(
        `SELECT i.*, c.category_name 
         FROM Items i 
         LEFT JOIN Category c ON i.category_id = c.category_id
         WHERE i.user_id = ? AND (i.name LIKE ? OR i.description LIKE ? OR i.location LIKE ?)
         ORDER BY i.created_at DESC`,
        [userId, searchTerm, searchTerm, searchTerm]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Item;