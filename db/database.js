/**
 * Created by liuchaorun on 2017/3/30.
 */
const config = require('./config');
const Sequelize = require('sequelize');
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    timezone:'+08:00',
    pool: {
        max: 5,
        min: 0,
        idle: 3000
    }
});

function defineModel(name, attributes) {
    let attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value
            };
        }
    }
    if(name!=='resource_picture'&&name!=='picture'&&name!=='ad_type'&&name!=='ad_type_picture'&&name!=='feedback_info'&&name!=='user_ad_type'){
        attrs.created_at = {
            type: Sequelize.DATE,
        };
        attrs.updated_at = {
            type: Sequelize.DATE,
        };
        attrs.version = {
            type: Sequelize.BIGINT,
        };
    }
    // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
    //         if (k === 'type') {
    //             for (let key in Sequelize) {
    //                 if (key === 'ABSTRACT' || key === 'NUMBER') {
    //                     continue;
    //                 }
    //                 let dbType = Sequelize[key];
    //                 if (typeof dbType === 'function') {
    //                     if (v instanceof dbType) {
    //                         if (v._length) {
    //                             return `${dbType.key}(${v._length})`;
    //                         }
    //                         return dbType.key;
    //                     }
    //                     if (v === dbType) {
    //                         return dbType.key;
    //                     }
    //                 }
    //             }
    //         }
    //         return v;
    //     }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (name !== 'user_picture')
                    if (obj.isNewRecord) {
                        console.log('will create entity...' + obj);
                        obj.created_at = now;
                        obj.updated_at = now;
                        obj.version = 0;
                    } else {
                        console.log('will update entity...');
                        obj.version++;
                    }
            }
            }
        }
    );
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

let exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({force: true});
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

module.exports = exp;