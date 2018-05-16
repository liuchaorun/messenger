const lib = require('../lib/lib');
const Sequelize = require('sequelize');
const config = require('../config/config');

let sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        dialect:'postgres',
        host:config.db.host,
        timezone:'+08:00'
    }
);

lib.autoImport(__dirname+'/models/',function (models) {
    sequelize.import(models);
});

let models = sequelize.models;
Object.keys(models).forEach((tableName) => {
    if(models[tableName].options.hasOwnProperty('associate')){
        models[tableName].options.associate(models);
    }
});

module.exports = sequelize;