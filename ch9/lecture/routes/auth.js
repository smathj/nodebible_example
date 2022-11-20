const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const router = express.Router();


// * 회원가입 컨트롤러
router.post('/join',isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12); // 암호 해쉬화
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});



// * 로그인
router.post('/login', isNotLoggedIn,  (req, res, next) => {
  // passport.authenticate('local' ... 부분으로 로컬 전략 실행
  passport.authenticate('local', (authError, user, info) => {
    // 서버 에러
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    // 비밀번호 불일치
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }

    // ! req.login, 사용자 객체에넣어줌 -> 시리얼 라이즈 발동
    return req.login(user, (loginError) => {
      // 시리얼 라이즈 에러
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 시리얼 라이즈 성공
      // 세션 쿠키를 브라우저로 보냄, 이후 호출에는 브라우저가 세션 쿠키를 보내주잖아?
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

});


// * 카카오 로그인하기
router.get('/kakao', passport.authenticate('kakao'));
// 카카오 화면에서 로그인
// 로그인 성공시 아래의 콜백함수를 호출함 (카카오가 나에게)
// 두번째 passport.authenticate('kakao' 일때 , ... 나의 카카오 전략 실행함



// * 카카오 콜백 함수
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});



// * 로그아웃
router.get('/logout', isLoggedIn,(req, res) => {
  // ! req.logout, 세션쿠키제거
  console.log("/auth/logout 호출")
  req.logout(() => {
    req.session.destroy();
    res.redirect('/');
  });
});


module.exports = router;
