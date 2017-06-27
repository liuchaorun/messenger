/**
 * Created by lcr on 17-3-25.
 */
const md5 = require('md5');
const router = require('koa-router')();
const model = require('../db/model');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
const multer = require('koa-multer');
const images = require("image-size");
const fs = require('fs');
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
let storage = multer.diskStorage({
    destination: function (ctx, file, cb) {
        cb(null, '/home/ubuntu/file/');
    },
    filename: function (ctx, file, cb) {
        let fileFormat = (file.originalname).split(".");
        process.custom_picture_name = 'picture-' + Date.now();
        cb(null, process.custom_picture_name + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({storage: storage});
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 3000
    }
});
let transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'pobooks@126.com',
        pass: 'pobooks126'
    }
});
router.post('/action=signup',async (ctx,next)=>{
    let user_num = user.count({where:{email:ctx.request.body.email}});
    let n = Math.floor(Math.random() * 9000 + 1000);
    ctx.session.verify = n.toString();
    if(user_num===1){
        ctx.api(200,{},{code:10001,msg:'该用户已存在'});
    }
    else{
        let mailOptions = {
            from: '"messenger" <pobooks@126.com>',
            to: ctx.request.body.email,
            subject: '天天看图',
            text: '天天看图验证码:' + ctx.session.verify,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        ctx.api(200,{},{code:100000,msg:'验证码已下发'});
    }
    await next();
});
router.post('/action=verify',async (ctx,next)=>{
    if(ctx.session.verify===ctx.request.body.verify){
        await user.create({
            username:ctx.request.body.username,
            email:ctx.request.body.email,
            password:ctx.request.body.password
        });
        ctx.api(200,{},{code:10000,msg:'注册成功！'});
    }
    else ctx.api(200,{},{code:10002,msg:'验证码错误！'});
    await next();
});
router.post('/action=login',async (ctx,next)=>{
    let user_num = await user.count({where:{email:ctx.request.body.email}});
    if(user_num===0) ctx.api(200,{},{code:10003,msg:'该用户不存在！'});
    else{
        if(ctx.cookies.get('user',{})===undefined){
            let user_person = await user.findOne({where:{email:ctx.request.body.email}});
            if(user_person.password===ctx.request.body.password){
                ctx.session.custom_email = user_person.email;
                let data={};
                data.username = user_person.username;
                let md = md5(ctx.custom_email);
                if (ctx.request.body.remember_me === true ){
                    ctx.cookies.set(
                        'user',
                        md,
                        {
                            domain: '118.89.197.156',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            maxAge: 60*60*24*30*1000, // cookie有效时长
                            httpOnly: true,  // 是否只用于http请求中获取
                            overwrite: true  // 是否允许重写
                        }
                    );
                }
                else{
                    ctx.cookies.set(
                        'user',
                        md,
                        {
                            domain: '118.89.197.156',  // 写cookie所在的域名
                            path: '/',       // 写cookie所在的路径
                            httpOnly: true,  // 是否只用于http请求中获取
                            overwrite: true  // 是否允许重写
                        }
                    );
                }
                ctx.api(200,data,{code:10000,msg:'登录成功！'});
            }
        }
        else{
            let user_person = await user.findOne({where:{eamil:ctx.session.email}});
            let data={};
            data.username=user_person.username;
            data.email=user_person.email;
            ctx.api(200,data,{code:10000,msg:'自动登录成功！'});
        }
    }
    await next();
});
module.exports = router;