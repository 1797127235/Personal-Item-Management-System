const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // 根据ID获取用户
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据邮箱获取用户
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 创建新用户
  static async create(userData) {
    try {
      // 生成密码哈希
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // 插入新用户
      const [result] = await db.query(
        'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // 更新用户信息
  static async update(userId, userData) {
    try {
      const [result] = await db.query(
        'UPDATE Users SET username = ?, email = ? WHERE user_id = ?',
        [userData.username, userData.email, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 更新用户密码
  static async updatePassword(userId, newPassword) {
    try {
      // 生成新密码哈希
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // 更新密码
      const [result] = await db.query(
        'UPDATE Users SET password_hash = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;