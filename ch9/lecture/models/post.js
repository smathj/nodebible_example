const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {

    // * 1번쨰 함수, 모델 정의
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    // * 2번쨰 함수, 관계 정의
    static associate(db) {
        // 다대일
        db.Post.belongsTo(db.User);
        // 다대다, 중간 테이블 PostHashtag
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

    }
};
