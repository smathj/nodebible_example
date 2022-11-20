const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');  // index.js
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();

app.set('port', process.env.PORT || 3001);  // port
app.set('view engine', 'html'); // view 엔진

nunjucks.configure('views', {
  express: app,
  watch: true,
});


// * Sequelize로 DB 연결 -> 테이블 없는경우 생성함
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });



app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));  // 정적 파일
app.use(express.json());  // request json 요청
app.use(express.urlencoded({ extended: false })); // request form 요청

// 컨트롤러
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);



// * 404 미들웨어
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// * Error 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


// * Port
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
