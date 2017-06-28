/**
 * Created by lcr on 17-5-16.
 */
const model = require('./model');
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
let user = model.user;
let screen = model.screen;
let picture = model.picture;
let resource = model.resource;
let resource_picture = model.resource_picture;
user.hasMany(picture,{foreignKey:'user_id'});
user.hasMany(screen,{foreignKey:'user_id'});
user.hasMany(resource,{foreignKey:'user_id'});
screen.hasMany(resource,{foreignKey:'screen_id'});
resource.belongsToMany(picture,{through:resource_picture,foreignKey:'resource_id'});
picture.belongsToMany(resource,{through:resource_picture,foreignKey:'picture_id'});
async function a() {
    let user_person = await user.findOne({where:{email:'1558531230@qq.com'}});
    let screen_new = await screen.findOne({where:{uuid:'12345678'}});
    await user_person.addScreen(screen_new);
}
a();