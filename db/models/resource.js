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
    name:{
        type:Sequelize.STRING(255)
    },
    md5:Sequelize.STRING(255),
    user_id:Sequelize.BIGINT,
    remark:Sequelize.STRING(255)
});