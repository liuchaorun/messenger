const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('user_ad_type',{
    user_id:Sequelize.BIGINT,
    ad_type_id::Sequelize.BIGINT
});