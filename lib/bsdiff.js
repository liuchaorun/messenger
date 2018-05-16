// let path = require('path'),
//     child_process = require('child_process');
//
// module.exports = function(originalFile, targetFile, patchFile, cb) {
//
//     let bsdiffPath = path.join(__dirname, 'bin', process.platform, 'bsdiff');
//
//     if (process.platform === 'win32') {
//         bsdiffPath += '.exe';
//     }
//
//     let options = {
//         timeout: 60 * 1000
//     };
//
//     let args = [originalFile, targetFile, patchFile];
//
//     return child_process.execFile(bsdiffPath, args, options, cb);
// };
let shell = require('shelljs');

let create_qcode = function (url, file_name, file_path) {
    return new Promise(function (resolve, reject) {
        shell.exec('myqr '+url+' -n'+file_name+' -d'+file_path,function (code, stdout, stderr) {
            if (code === 0){
                resolve('success');
            }
            else {
                reject('failed');
            }
        })
    });
};


// const md5 = require('md5');
// const router = require('koa-router')();
// const koaBody = require('koa-body');
// const model = require('../db/model');
// const nodemailer = require('nodemailer');
// const config = require('../db/config');
// const Sequelize = require('sequelize');
// const images = require("image-size");
// const isOnline = require('./isOnlie');
// const fs = require('fs');
// const gm = require('gm');
// const upDir = '/home/ubuntu/file/';
// let user = model.user;
// let screen = model.screen;
// let picture = model.picture;
// let resource = model.resource;
// let resource_picture = model.resource_picture;
// let feedback_info = model.feedback_info;
// let ad_type = model.ad_type;
// let ad_type_picture = model.ad_type_picture;
// let user_ad_type = model.user_ad_type;
// user.hasMany(picture, {foreignKey: 'user_id'});
// user.hasMany(screen, {foreignKey: 'user_id'});
// user.hasMany(resource, {foreignKey: 'user_id'});
// resource.hasMany(screen, {foreignKey: 'resource_id'});
// resource.belongsToMany(picture, {through: resource_picture, foreignKey: 'resource_id'});
// picture.belongsToMany(resource, {through: resource_picture, foreignKey: 'picture_id'});
// ad_type.belongsToMany(picture, {through:ad_type_picture, foreignKey:'ad_type_id'});
// picture.belongsToMany(ad_type, {through:ad_type_picture, foreignKey:'picture_id'});
// user.belongsToMany(ad_type, {through:user_ad_type, foreignKey:'user_id'});
// ad_type.belongsToMany(user, {through:user_ad_type, foreignKey:'ad_type_id'});
//
// let data={
//     adType:[]
// };
// user.findOne({where:{user_id:45}}).then((user_person)=>{
//     user_person.getAd_types().then((types)=>{
//         console.log(types);
//         if(types.length>0){
//             for(let i of types){
//                 data.adType.push(i.name);
//             }
//         }
//         console.log(data);
//     })
// });
// import fs from 'fs';
//
// console.log(fs.hasOwnProperty());
