const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// 시퀄라이즈 객체 생성
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;   // 안써도 됨 ㅇㅇ

db.User = User;
db.Comment = Comment;



User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

// db 객체 안에 sequelize, Sequelize(생성자), User, Comment 가 들어있다 :)
module.exports = db;
