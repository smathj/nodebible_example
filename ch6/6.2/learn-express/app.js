const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

// ! 미들웨어 깔금하게쓰기 ( express가 내부적으로 req, res, next 를 붙여 호출해준다 )
app.use(morgan('dev'));

// ! 미들웨어 실제는 이런모습으로 동작한다
// app.use((req,res,next) => {
//   morgan('dev')(req, res, next);
// });
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}



const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});



app.get('/upload', (req, res) => {
  req.session.text = 'hi';
  console.log(req.session);
  // console.log(req.session.text);
  // console.log(req.session.cookie);
  console.log('req.sessionID : ', req.sessionID);
  res.sendFile(path.join(__dirname, 'multipart.html'));
});



app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});








app.get('/', (req, res, next) => {
  console.log('GET / 요청에서만 실행됩니다.');
  next();
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});



app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});



app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
