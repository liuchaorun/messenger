/**
 * Created by liuchaorun on 2017/3/30.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('user',{
    user_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type:Sequelize.STRING(255)
    },
    email: {
        type:Sequelize.STRING(255)
    },
    password: {
        type:Sequelize.STRING(32)
    },
    last_login_time:Sequelize.DATE,
    work_place:Sequelize.STRING(255)
});
