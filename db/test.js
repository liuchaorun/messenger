/**
 * Created by lcr on 17-5-16.
 */
// const model = require('./model');
// const config = require('./config');
// const Sequelize = require('sequelize');
// let sequelize = new Sequelize(config.database, config.username, config.password, {
//     host: config.host,
//     dialect: 'postgres',
//     timezone:'+08:00',
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 3000
//     }
// });
// let user = model.user;
// let screen = model.screen;
// let picture = model.picture;
// let resource = model.resource;
// let resource_picture = model.resource_picture;
// user.hasMany(picture,{foreignKey:'user_id'});
// user.hasMany(screen,{foreignKey:'user_id'});
// user.hasMany(resource,{foreignKey:'user_id'});
// resource.hasMany(screen, {foreignKey: 'resource_id'});
// resource.belongsToMany(picture,{through:resource_picture,foreignKey:'resource_id'});
// picture.belongsToMany(resource,{through:resource_picture,foreignKey:'picture_id'});
// async function a() {
//     let resource_now = await resource.findOne({where: {resource_id: 17}});
//     let resource_now_screen = await resource_now.getScreens();
//     let user_person = await user.findOne({where: {email: '1558531230@qq.com'}});
//     let user_person_screen = await user_person.getScreens();
//     let data = {},n=0;
//     data.screen = new Array();
//     for(let i of user_person_screen){
//         let flag=0;
//         for(let j of resource_now_screen) if(i.screen_id===j.screen_id) flag=1;
//         if(flag===0){
//             data.screen[n]={
//                 name:i.name,
//                 screen_id:i.screen_id,
//                 note:i.remark
//             };
//             n++;
//         }
//     }
//     console.log(user_person_screen);
//     console.log(resource_now_screen);
//     console.log(data);
// }
// a();
//const fs = require('fs');
// let data = {};
// data.i = "qwe";
// data = JSON.stringify(data);
// fs.writeFileSync('/home/lcr/1.json',data);
// let d = fs.readFileSync('/home/lcr/1.json');
// d = JSON.parse(d);
// console.log(d.i);
//fs.unlinkSync('/home/lcr/1.json');
// Array.prototype.minus = function (arr) {
//     let result = new Array();
//     let obj = {};
//     for (let i = 0; i < arr.length; i++) {
//         obj[arr[i]] = 1;
//     }
//     for (let j = 0; j < this.length; j++) {
//         if (!obj[this[j]]) {
//             obj[this[j]] = 1;
//             result.push(this[j]);
//         }
//     }
//     return result;
// };
// let a = new Array(1,2),b =new Array();
// b[0]=1;
// console.log(a.minus(b)[0]);
const gm = require('gm');
gm('/home/lcr/1.jpg').resize(960,null).write('/home/lcr/2.jpg',()=>{});