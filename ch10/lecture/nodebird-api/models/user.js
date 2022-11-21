const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {

    // * 1번쨰 함수, 모델 정의
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }


    // * 2번쨰 함수, 관계 정의
    static associate(db) {
        // 일대다
        db.User.hasMany(db.Post);

        // 다대다 ( 회원과 팔로윙 )
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',  // 중간 테이블의 FK의 칼럼명 ( 기본값은 user_id )
            as: 'Followers',            // 자바스크립트에서 사용할 명
            through: 'Follow',          // 중간 테이블
        });
        /* 내가 팔로윙에 있다면 상대방이 팔로워이다 */
        // 특정 팔로윙 아이디로, 그 사람을 팔로워한 사람들을 찾을것임

        // 다대다 ( 회원과 팔로워 )
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',   // 중간 테이블의 FK의 칼럼명 ( 기본값은 user_id )
            as: 'Followings',           // 자바스크립트에서 사용할 명
            through: 'Follow',          // 중간 테이블
        });
        /* 내가 팔로워에 있다면 상대방이 팔로윙이다 */
        // 특정 팔로워가, 팔로윙 한사람 찾을 것임
        
        // 일대다
        db.User.hasMany(db.Domain);
    }

}