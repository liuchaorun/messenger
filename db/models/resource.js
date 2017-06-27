/**
 * Created by lcr on 17-6-27.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('resource',{
    resource_id:{
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    md5:Sequelize.STRING(255),
    user_id:Sequelize.BIGINT,
    screen_id:Sequelize.BIGINT
});