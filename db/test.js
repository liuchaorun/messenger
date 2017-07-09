/**
 * Created by lcr on 17-5-16.
 */
const model = require('./model');
const config = require('./config');
const Sequelize = require('sequelize');
const md5 =require('md5');
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
resource.hasMany(screen, {foreignKey: 'resource_id'});
resource.belongsToMany(picture,{through:resource_picture,foreignKey:'resource_id'});
picture.belongsToMany(resource,{through:resource_picture,foreignKey:'picture_id'});
async function a() {
    let data={};
    let user_person = await user.findOne({where:{email:'1558531230@qq.com'}});
    let pictures_all = await user_person.getPictures();
    data.pictures = new Array();
    for(let i =0;i<pictures_all.length;++i){
        data.pictures[i]={
            picture_id : pictures_all[i].picture_id,
            url : pictures_all[i].thumbnails_url
        };
        let pack_all = await pictures_all[i].getResources();
        data.pictures[i].pack = new Array();
        for(let j =0;j<pack_all.length;++j){
            data.pictures[i].pack[j] = pack_all[j].name;
        }
    }
    console.log(data);
}
a();
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
// const gm = require('gm');
// gm('/home/lcr/1.jpg').resize(960,null).write('/home/lcr/2.jpg',()=>{});
// let fs = require('fs');
// let crypto = require('crypto');
//
// let path = '/target/file.data';
// let start = new Date().getTime();
// let md5sum = crypto.createHash('md5');
// let stream = fs.createReadStream(path);
// stream.on('data', function(chunk) {
//     md5sum.update(chunk);
// });
// stream.on('end', function() {
//     str = md5sum.digest('hex').toUpperCase();
//     console.log('文件:'+path+',MD5签名为:'+str+'.耗时:'+(new Date().getTime()-start)/1000.00+"秒");
// });
// let a = "ab.c";
// let q = a.split('.');
// console.log(q);