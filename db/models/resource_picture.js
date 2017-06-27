/**
 * Created by lcr on 17-6-27.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('resource_picture',{
    resource_id:Sequelize.BIGINT,
    picture_id:Sequelize.BIGINT
});