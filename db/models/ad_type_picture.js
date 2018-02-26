const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('ad_type_picture',{
    ad_type_id:Sequelize.BIGINT,
    picture_id:Sequelize.BIGINT
});