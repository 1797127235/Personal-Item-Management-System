const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

// 加载环境变量
dotenv.config();

// 初始化应用
const app = express();

// Passport 配置
require('./config/passport')(passport);

// 配置视图引擎
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// 请求体解析
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 配置会话
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport 中间件
app.use(passport.initialize());
app.use(passport.session());

// Flash 消息
app.use(flash());

// 全局变量
app.use((req, res, next) => {
  // 初始化为空字符串，而不是从flash中获取值，这样就不会显示消息
  res.locals.success_msg = '';
  res.locals.error_msg = '';
  res.locals.error = '';
  res.locals.user = req.user || null;
  next();
});

// 路由
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/items'));
app.use('/categories', require('./routes/categories'));

// 404 处理
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '页面未找到'
  });
});

// 端口设置
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});