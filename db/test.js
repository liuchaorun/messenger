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
const user = model.user;
const picture = model.picture;
const screen = model.screen;
const screen_picture = model.screen_picture;
screen.belongsToMany(picture,{through:screen_picture,foreignKey:'screen_id'});
picture.belongsToMany(screen,{through:screen_picture,foreignKey:'picture_id'});
user.hasMany(picture,{foreignKey:'user_id'});
user.hasMany(screen,{foreignKey:'user_id'});
async function a() {
    let user1 = await user.findOne({where:{email:'1558531230@qq.com'}});
    let screen1 = await user1.getScreens({where:{screen_id:49}});
    let picturea = await screen1[0].getPictures();
    await screen1[0].removePictures(picturea);
}
a();