const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


// * 팔로잉 기능, A가 B를 쫒는거임
// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    // 나
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      // 내가 req.params.id를 팔로윙 하겠다 , 내아이디가 포랜키 followerId가 되고
      await user.addFollowings([parseInt(req.params.id, 10)]);
      // setFollowings 는 수정이라서 조심하게 사용해야함
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
