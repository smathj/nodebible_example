const Sequelize = require('sequelize');

// 모델은 클래스로 만든다, 즉 User 모델
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,  // createdAt, updatedAt 기본으로 넣을지 말지
      underscored: false, // 언더스코어 ㅇㅇ ( 자동으로 만들어지는 칼럼들을 대하여 )
      modelName: 'User',
      tableName: 'users',
      paranoid: false,  // deletedAt (삭제날짜)
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  // 관계 설정 -> ->
  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
};
