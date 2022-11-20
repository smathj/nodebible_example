const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', // req.body.email 가 되어야함 (일치가 포인트)
    passwordField: 'password',  // req.body.password 가 되어야함 (일치가 포인트)
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      // * 회원 O
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        // 비밀번호 일치
        if (result) {
          done(null, exUser); // local의 콜백함수로 이동 (auth 라우터쪽)
        // 비밀번호 불일치
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      // * 회원 X
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
/*
done 의 첫번째 파라미터 : 서버에러
       두번째 파라미터 : 성공 데이터
       세번째 파라미터 : 실패 메세지
 */