const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('ad_type',{
    ad_type_id:{
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    name:Sequelize.STRING(255)
});