const database = require("../database");
const Sequelize = require('sequelize');
module.exports=database.defineModel('feedback_info',{
    browser:Sequelize.STRING(255),
    deviceType:Sequelize.STRING(255),
    device:Sequelize.STRING(255),
    os:Sequelize.STRING(255),
    ip:Sequelize.STRING(255),
    uuid:Sequelize.STRING(255),
    position:Sequelize.STRING(255),
    adType:Sequelize.STRING(255),
    adId:Sequelize.STRING(255),
    scanTime:Sequelize.STRING(255)
});
