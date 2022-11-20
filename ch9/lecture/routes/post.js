const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// * 업로드 폴더생성
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}


// !////////////////////////////////////////////////////////////////////////////
// ! 핵심로직 ///////////////////////////////////////////////////////////////////
// !////////////////////////////////////////////////////////////////////////////
// multer 자체는 미들웨어가 아니라 실행후에 리턴된 객체에 미들웨어가 들어있다, 즉 upload로 받았음 (single multi ... )
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/'); // 업로드 폴더
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);  // 확장자
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 파일하나당 5MB 용량
});


const upload2 = multer(); // 옵션 파라미터 객체 없이 (멀티파트지만 파일없는경우)
// !///////////////////////////////////////////////////////////////////////////





// * 컨트롤러 ( 이미지와 내용을 나눠서 속도 향상시키기 )
// * 이미지 있는것
// upload.single('img')의 'img' 파라미터이름 , 즉 name값일듯
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` }); // express static 추가
});



// * 이미지없는것
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    
    console.log(req.user);
    // 게시글
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      // 게시글에 해시태그 추가
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
