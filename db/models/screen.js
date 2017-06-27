/**
 * Created by lcr on 17-6-27.
 */
const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('user',{
    screen_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type:Sequelize.STRING(255)
    },
    time: {
        type:Sequelize.BIGINT
    },
    user_id:Sequelize.BIGINT,
    uuid:{
        type:Sequelize.STRING(255)
    },
    remark:{
        type:Sequelize.STRING(255)
    }
});