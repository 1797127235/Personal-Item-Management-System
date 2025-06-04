const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池配置
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 如果指定了端口，添加到配置中
if (process.env.DB_PORT) {
  poolConfig.port = parseInt(process.env.DB_PORT);
}


// 创建数据库连接池
const pool = mysql.createPool(poolConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('云数据库连接成功');
    connection.release();
  } catch (err) {
    console.error('云数据库连接失败:', err);
    console.error('错误详情:', err.message);
  }
}

// 初始化时测试连接
testConnection();

module.exports = pool;