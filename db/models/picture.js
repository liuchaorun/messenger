/**
 * Created by lcr on 17-6-27.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('picture',{
    picture_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type:Sequelize.STRING(255)
    },
    size: {
        type:Sequelize.BIGINT
    },
    url: {
        type:Sequelize.STRING(32)
    },
    user_id: {
        type: Sequelize.BIGINT
    },
    image_type:{
        type:Sequelize.STRING(255)
    },
    image_size:{
        type:Sequelize.STRING(255)
    }
});