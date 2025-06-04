const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // 查找用户
        const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
          return done(null, false, { message: '该邮箱未注册' });
        }

        const user = rows[0];
        
        // 验证密码
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: '密码不正确' });
          }
        });
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err, null);
    }
  });
};