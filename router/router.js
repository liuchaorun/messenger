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
router.post('/action=signup', async (ctx, next) => {
    let data = {};
    ctx.custom_email = ctx.request.body.email;
    let n = Math.floor(Math.random() * 9000 + 1000);
    ctx.session.verify = n.toString();
    let user1 = await user.count({where: {email: ctx.custom_email}});
    if (user1 === 1) ctx.api(200, data, {code: 0, msg: '该用户已存在'});
    else {
        let mailOptions = {
            from: '"dayDayPicture" <pobooks@126.com>',
            to: ctx.custom_email,
            subject: '天天看图', // Subject line
            text: '天天看图验证码:' + ctx.session.verify,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        ctx.api(200, data, {code: 1, msg: '已下发验证码'});
    }
    await next();

});
router.post('/action=verify', async (ctx, next) => {
    let data = {};
    if (ctx.session.verify === ctx.request.body.verify) {
        user.create({
            username: ctx.request.body.username,
            email: ctx.request.body.email,
            password: ctx.request.body.password,
            business:'无'
        });
        ctx.api(200, data, {code: 1, msg: '注册成功'});
    }
    else ctx.api(200, data, {code: 0, msg: '注册失败'});
    await next();
});
router.post('/action=login', async (ctx, next) => {
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    let data = {};
    if(ctx.request.body.id===0){
        if(ctx.cookies.get('user',{})===undefined){
            let n = await user.count({where: {email: ctx.custom_email}});
            if (n === 1) {
                let user1 = await user.findOne({where: {email: ctx.custom_email}});
                if (user1.password === ctx.custom_password) {
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
                    ctx.session.custom_email=ctx.request.body.email;
                    data.username = user1.username;
                    ctx.api(200, data, {code: 1, msg: '登录成功'});
                }
                else ctx.api(200, data, {code: 0, msg: '密码错误'});
            }
            else ctx.api(200, data, {code: 0, msg: '该用户不存在'});
        }
        else{
            let user1 = await user.findOne({where: {email: ctx.session.custom_email}});
            data.email=user1.email;
            data.username = user1.username;
            ctx.api(200,data,{code:1,msg:'自动登录成功！'});
        }
    }
    else{
        if(ctx.cookies.get('user',{})===undefined){
            if(await user.count({where:{email:ctx.custom_email}})===1){
                let user1 = await user.findOne({where:{email:ctx.custom_email}});
                let screen1 =await user1.getScreens({where:{uuid:ctx.request.body.uuid}});
                let md = md5(ctx.custom_email);
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
                if(screen1.length===0){
                    let screenNow = await user1.createScreen({
                        name:'无',
                        place:' ',
                        time:10,
                        uuid:ctx.request.body.uuid
                    });
                    data. screen_id=screenNow.screen_id;
                    data.name=screenNow.name;
                    data.place=screenNow.place;
                    data.time=screenNow.time;
                    screenNow.update({name:data.screen_id});
                    ctx.api(200,data,{code:1,msg:'第一次登录成功'});
                }
                else{
                    data.screen_id=screen1[0].screen_id;
                    data.name=screen1[0].name;
                    data.place=screen1[0].place;
                    data.time=screen1[0].time;
                    ctx.api(200,data,{code:1,msg:'已存在该设备，不使用cookies成功'})
                }
            }
        }
        else{
            let screen1 = await screen.findOne({where:{screen_id:ctx.request.body.screen_id}});
            let user1 = await user.findOne({where:{user_id:screen1.user_id}});
            data.email=user1.email;
            data.screen_id=ctx.session.screen_id;
            data.name=screen1.name;
            data.place=screen1.place;
            data.time=screen1.time;
            ctx.api(200,data,{code:1,msg:'已存在该设备，使用cookies成功'})
        }
    }
    await next();
});
module.exports = router;