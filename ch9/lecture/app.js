const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');   // 최대한 위에
const passport = require('passport');
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');


const app = express();

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');


nunjucks.configure('views', {   // * views 폴더가 랜더링 html파일들있는곳
    express: app,
    watch: true,
});

// force : true 항상 삭제하고만듬
// alter : true 수정함
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
passportConfig();   // 전략 실행



app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));            // * public 폴더가 정적 파일있는 곳
app.use('/img', express.static(path.join(__dirname, 'uploads')));    // * 프론트에서 /img/파일명 으로 업로드된파일 찾음

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));


app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// express session보다 아래위치해야함
app.use(passport.initialize());
app.use(passport.session());    // 로그인후 요청때 -> 디시리얼라이즈 실행


// * 컨트롤러
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);




















app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;   // res.locals 템플릿 엔진의 변수
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
