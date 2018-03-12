const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('feedback_info',{
    id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    browser:Sequelize.STRING(255),
    deviceType:Sequelize.STRING(255),
    device:Sequelize.STRING(255),
    os:Sequelize.STRING(255),
    ip:Sequelize.STRING(255),
    uuid:Sequelize.STRING(255),
    position:Sequelize.STRING(255),
    ad_type:Sequelize.STRING(255),
    ad_id:Sequelize.STRING(255),
    scan_time:Sequelize.STRING(255)
});
