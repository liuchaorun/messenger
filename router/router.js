/**
 * Created by lcr on 17-3-25.
 */
const md5 = require('md5');
const router = require('koa-router')();
const koaBody = require('koa-body');
const model = require('../db/model');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
const images = require("image-size");
const isOnline = require('./isOnlie');
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
    else ctx.api(200,{},{code:0,msg:'验证码错误！'});
    await next();
});
router.post('/action=login',async (ctx,next)=>{
    let user_num = await user.count({where:{email:ctx.request.body.email}});
    if(user_num===0) ctx.api(200,{},{code:0,msg:'该用户不存在！'});
    else{
        if(ctx.cookies.get('user',{})===undefined){
            let user_person = await user.findOne({where:{email:ctx.request.body.email}});
            if(user_person.password===ctx.request.body.password){
                ctx.session.custom_email = user_person.email;
                let data={};
                data.username = user_person.username;
                let md = md5(ctx.session.custom_email);
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
                ctx.session.last_login_time = user_person.last_login_time;
                await user_person.update({
                    last_login_time:Date.now(),
                });
                ctx.api(200,data,{code:10000,msg:'登录成功！'});
            }
        }
        else{
            let user_person = await user.findOne({where:{email:ctx.session.email}});
            ctx.session.last_login_time = user_person.last_login_time;
            await user_person.update({
                last_login_time:Date.now(),
            });
            let data={};
            data.username=user_person.username;
            data.email=user_person.email;
            ctx.api(200,data,{code:10000,msg:'自动登录成功！'});
        }
    }
    await next();
});
router.post('/action=forget',async (ctx,next)=>{
    let user_num = await user.count({where:{email:ctx.request.body.email}});
    if(user_num===0) ctx.api(200,{},{code:0,msg:'不存在该用户！'});
    else{
        let user_person = await user.findOne({where:{email:ctx.request.body.email}});
        if(user_person.username===ctx.request.body.username){
            ctx.session.forget_email = ctx.request.body.email;
            ctx.api(200,{},{code:10000,msg:'验证成功！'});
        }
        else{
            ctx.api(200,{},{code:0,msg:'用户名错误！'});
        }
    }
    await next();
});
router.post('/action=new_password',async (ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.forget_email}});
    await user_person.update({
        password:ctx.request.body.new_password
    });
    ctx.api(200,{},{code:10000,msg:'修改密码成功！'});
    await next();
});
router.post('/action=get_info',async (ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let user_picture = await user_person.getPictures();
    let user_screen = await user_person.getScreens();
    let data ={};
    data.username = user_person.username;
    data.email = user_person.email;
    data.last_login_time = ctx.session.last_login_time;
    data.picture_num = user_picture.length;
    data.screen_num = user_screen.length;
    ctx.api(200,data,{code:1,msg:'获取信息成功'});
    await next();
});
router.post('/action=get_screen',async (ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let user_screen = await user_person.getScreens();
    let data = {};
    data.info = new Array();
    for(let i =0 ; i < user_screen.length ; ++i) {
        let resource_name = await user_screen[i].getResources();
        data.info[i]={
            uuid:user_screen[i].uuid,
            status:isOnline(user_screen[i].updated_at,user_screen[i].time),
            name:user_screen[i].name,
            update_time:user_screen[i].updated_at,
            freq:user_screen[i].time,
            pack:resource_name.name,
            note:user_screen[i].remark
        }
    }
    ctx.api(200,data,{code:10000,msg:"获取成功！"});
    await next();
});
router.post('/action=add_screen',async(ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let screen_num = await screen.count({where:{uuid:ctx.request.body.uuid}});
    if(screen_num===0){
        ctx.api(200,{},{code:0,msg:'不存在该屏幕！'});
    }
    else{
        let screen_new = await screen.findOne({where:{uuid:ctx.request.body.uuid}});
        await user_person.addScreen(screen_new);
        ctx.api(200,{},{code:10000,msg:'添加成功！'});
    }
    await next();
});
router.post('/action=modify_screen',async (ctx,next)=>{
    let screen_uuid = ctx.request.body.uuid;
    for(let i of screen_uuid){
        let screen_new = await screen.findOne({where:{uuid:i}});
        if(ctx.request.body.new_name!==undefined) await screen_new.update({name:ctx.request.body.new_name});
        if(ctx.request.body.new_freq!==undefined) await screen_new.update({time:ctx.request.body.new_freq});
        if(ctx.request.body.new_note!==undefined) await screen_new.update({remark:ctx.request.body.new_note});
    }
    ctx.api(200,{},{code:10000,msg:'修改成功！'});
});
router.post('/action=del_screen',async (ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let uuid = ctx.request.body.uuid;
    for(let i of uuid){
        let screen_del = await screen.findOne({where:{uuid:i}});
        await user_person.removeScreen(screen_del);
        await screen.destroy({where:{uuid:i}});
    }
    ctx.api(200,{},{code:10000,msg:'删除成功！'});
    await next();
});
router.post('/action=upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir: '/home/ubuntu/file/'
    }
}),async (ctx, next) => {
    let files = ctx.request.body.files;
    for(let i = 0;i<files.file.length;++i){
        let fileFormat = (files.file[i].name).split(".");
        let file_name = 'picture-' + Date.now() + '.' + fileFormat[fileFormat.length - 1];
        let user_person = await user.findOne({where: {email:ctx.session.custom_email}});
        let image = images(files.file[i].path);
        await user_person.createPicture({
            name: file_name,
            size: files.file[i].size,
            image_size:image.width.toString()+'×'+ image.height.toString(),
            image_type:files.file[i].type,
            url: 'http://118.89.197.156:8000/' + file_name
        });
        fs.rename(files.file[i].path,'/home/ubuntu/file/'+file_name,(err)=>{
            console.log(err);
        })
    }
    ctx.api(200,{},{code:10000, msg: '上传成功'});
    await next();
});
module.exports = router;