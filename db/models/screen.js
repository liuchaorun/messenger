/**
 * Created by lcr on 17-6-27.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('screen',{
    screen_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    name:Sequelize.STRING(255),
    time:Sequelize.BIGINT,
    user_id:Sequelize.BIGINT,
    uuid:{
        type:Sequelize.STRING(255)
    },
    remark:Sequelize.STRING(255),
    resource_id:Sequelize.BIGINT,
    md5:Sequelize.STRING(32)
});