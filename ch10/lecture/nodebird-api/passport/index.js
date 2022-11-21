const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // * 시리얼 라이즈
    passport.serializeUser((user, done) => {
        done(null, user.id);    // ! 세션에 user의 id만 저장한다
    });


    // { id: 3, 'connect.sid': s%3189203810391280 }

    // * 디시리얼 라이즈
    // 세션의 user.id로 user객체 복구
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',    // 모델폴더의 user.js의 as부분과 매칭
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',   // 모델폴더의 user.js의 as부분과 매칭
            }],
        })
            .then(user => {
                // console.log("디시리얼 라이즈 시작")
                // console.log("팔로워")
                // console.log(user['Followers']);
                //
                // console.log("팔로윙")
                // console.log(user['Followings']);
                // console.log("디시리얼 라이즈 종료")
                done(null, user)
            })// req.user라는 속성에서 접근가능함, req.isAuthenticated()
            .catch(err => done(err));
    });

    local();    // * 로컬 전략 등록
    kakao();    // * 카카오 전략 등록
};
