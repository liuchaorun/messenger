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
const gm = require('gm');
const upDir = '/home/ubuntu/file/';
let user = model.user;
let screen = model.screen;
let picture = model.picture;
let resource = model.resource;
let resource_picture = model.resource_picture;
let feedback_info = model.feedback_info;
let ad_type = model.ad_type;
let ad_type_picture = model.ad_type_picture;
let user_ad_type = model.user_ad_type;
user.hasMany(picture, {foreignKey: 'user_id'});
user.hasMany(screen, {foreignKey: 'user_id'});
user.hasMany(resource, {foreignKey: 'user_id'});
resource.hasMany(screen, {foreignKey: 'resource_id'});
resource.belongsToMany(picture, {through: resource_picture, foreignKey: 'resource_id'});
picture.belongsToMany(resource, {through: resource_picture, foreignKey: 'picture_id'});
ad_type.belongsToMany(picture, {through:ad_type_picture, foreignKey:'ad_type_id'});
picture.belongsToMany(ad_type, {through:ad_type_picture, foreignKey:'picture_id'});
user.belongsToMany(ad_type, {through:user_ad_type, foreignKey:'user_id'});
ad_type.belongsToMany(user, {through:user_ad_type, foreignKey:'ad_type_id'});
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
        pass: 'messenger126'
    }
});

router.post('/action=signup', async (ctx, next) => {
    let user_num = await user.count({where: {email: ctx.request.body.email}});
    let n = Math.floor(Math.random() * 9000 + 1000);
    ctx.session.verify = n.toString();
    if (user_num === 1) {
        ctx.api(200, {}, {code: 0, msg: '该用户已存在'});
    }
    else {
        let mailOptions = {
            from: '"Messenger" <pobooks@126.com>',
            to: ctx.request.body.email,
            subject: 'Messenger',
            text: 'Messenger 注册验证码:' + ctx.session.verify,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        ctx.api(200, {}, {code: 1, msg: '验证码已下发'});
    }
    await next();
});

router.post('/action=verify', async (ctx, next) => {
    if (ctx.session.verify === ctx.request.body.verify) {
        await user.create({
            username: ctx.request.body.username,
            email: ctx.request.body.email,
            password: ctx.request.body.password
        });
        ctx.api(200, {}, {code: 1, msg: '注册成功！'});
    }
    else ctx.api(200, {}, {code: 0, msg: '验证码错误！'});
    await next();
});

router.post('/action=login', async (ctx, next) => {
    let user_num = await user.count({where: {email: ctx.request.body.email}});
    if (user_num === 0) ctx.api(200, {}, {code: 0, msg: '该用户不存在！'});
    else {
        if (ctx.cookies.get('user', {}) === undefined) {
            let user_person = await user.findOne({where: {email: ctx.request.body.email}});
            if (user_person.password === ctx.request.body.password) {
                ctx.session.custom_email = user_person.email;
                let data = {};
                data.username = user_person.username;
                let md = md5(ctx.session.custom_email);
                ctx.cookies.set(
                    'user',
                    md,
                    {
                        domain: '118.89.197.156:3000',  // 写cookie所在的域名
                        path: '/',       // 写cookie所在的路径
                        maxAge: 60 * 60 * 24 * 30 * 1000, // cookie有效时长
                        httpOnly: true,  // 是否只用于http请求中获取
                        overwrite: true  // 是否允许重写
                    }
                );
                ctx.session.last_login_time = user_person.last_login_time;
                await user_person.update({
                    last_login_time: Date.now(),
                });
                ctx.api(200, data, {code: 1, msg: '登录成功！'});
            }
            else{
                ctx.api(200,{},{code:0,msg:'密码错误！'});
            }
        }
        else {
            let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
            ctx.session.last_login_time = user_person.last_login_time;
            await user_person.update({
                last_login_time: Date.now(),
            });
            let data = {};
            data.username = user_person.username;
            data.email = user_person.email;
            ctx.api(200, data, {code: 1, msg: '登录成功！'});
        }
    }
    await next();
});

router.post('/action=forget', async (ctx, next) => {
    let user_num = await user.count({where: {email: ctx.request.body.email}});
    if (user_num === 0) ctx.api(200, {}, {code: 0, msg: '不存在该用户！'});
    else {
        let user_person = await user.findOne({where: {email: ctx.request.body.email}});
        if (user_person.username === ctx.request.body.username) {
            ctx.session.forget_email = ctx.request.body.email;
            ctx.api(200, {}, {code: 1, msg: '验证成功！'});
        }
        else {
            ctx.api(200, {}, {code: 0, msg: '用户名错误！'});
        }
    }
    await next();
});

router.post('/action=new_password', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.forget_email}});
    await user_person.update({
        password: ctx.request.body.new_password
    });
    ctx.api(200, {}, {code: 1, msg: '修改密码成功！'});
    await next();
});

router.post('/action=get_info', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let user_picture = await user_person.getPictures();
    let user_screen = await user_person.getScreens();
    let data = {};
    data.username = user_person.username;
    data.email = user_person.email;
    data.work_place = user_person.work_place;
    data.last_login_time = ctx.session.last_login_time;
    data.picture_num = user_picture.length;
    data.screen_num = user_screen.length;
    ctx.api(200, data, {code: 1, msg: '获取信息成功'});
    await next();
});

router.post('/action=get_screen', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let user_screen = await user_person.getScreens();
    let data = {};
    data.info = [];
    for (let i = 0; i < user_screen.length; ++i) {
        let resource_name = await resource.findOne({where:{resource_id:user_screen[i].resource_id}});
        data.info[i] = {
            uuid: user_screen[i].uuid,
            status: isOnline(user_screen[i].updated_at, user_screen[i].time),
            name: user_screen[i].name,
            update_time: user_screen[i].updated_at,
            freq: user_screen[i].time,
            pack: resource_name===null?'无':resource_name.name,
            note: user_screen[i].remark
        }
    }
    ctx.api(200, data, {code: 1, msg: "获取成功！"});
    await next();
});

router.post('/action=add_screen', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let screen_num = await screen.count({where: {uuid: ctx.request.body.uuid}});
    if (screen_num === 0) {
        ctx.api(200, {}, {code: 0, msg: '不存在该屏幕！'});
    }
    else {
        let screen_new = await screen.findOne({where: {uuid: ctx.request.body.uuid}});
        await user_person.addScreen(screen_new);
        ctx.api(200, {}, {code: 1, msg: '添加成功！'});
    }
    await next();
});

router.post('/action=modify_screen', async (ctx, next) => {
    let screen_uuid = ctx.request.body.uuid;
    for (let i of screen_uuid) {
        let screen_new = await screen.findOne({where: {uuid: i}});
        if (ctx.request.body.new_name !== undefined) await screen_new.update({name: ctx.request.body.new_name});
        if (ctx.request.body.new_freq !== undefined) {
            await screen_new.update({
                time: ctx.request.body.new_freq,
                md5:md5(Date.now())
            });
        }
        if (ctx.request.body.new_note !== undefined) await screen_new.update({remark: ctx.request.body.new_note});
    }
    ctx.api(200, {}, {code: 1, msg: '修改成功！'});
    await next();
});

router.post('/action=del_screen', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let uuid = ctx.request.body.uuid;
    for (let i of uuid) {
        let screen_del = await screen.findOne({where: {uuid: i}});
        await user_person.removeScreen(screen_del);
        await screen_del.destroy();
    }
    ctx.api(200, {}, {code: 1, msg: '删除成功！'});
    await next();
});

router.post('/action=upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir: upDir
    }
}), async (ctx, next) => {
    let files = ctx.request.body.files;
    console.log('body'+ctx.request.body);
    console.log(ctx.request.body.name);
    if(files.file.name === undefined){
        for (let i = 0; i < files.file.length; ++i) {
            let fileFormat = (files.file[i].name).split(".");
            let file_name = 'picture-' + Date.now() + '.' + fileFormat[fileFormat.length - 1];
            let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
            let image = images(files.file[i].path);
            let picture_now = await user_person.createPicture({
                name: ctx.request.body.name + i,
                file_name:file_name,
                size: files.file[i].size,
                image_size: image.width.toString() + '×' + image.height.toString(),
                image_type: files.file[i].type,
                url: 'http://118.89.197.156:8000/' + file_name,
                thumbnails_url:'http://118.89.197.156:8000/thumbnails_'+file_name,
                position:ctx.request.body.position,
                target:ctx.request.body.target
            });
            fs.rename(files.file[i].path, upDir + file_name, (err) => {
                console.log(err);
            });
            let adTypes = ctx.request.body.type;
            for(let j = 0; j < adTypes.length; j++){
                let adType = await ad_type.findOne({where:{name:adTypes[j]}});
                await picture_now.addAd_type(adType);
            }
            gm(upDir + file_name).resize(null,200).write(upDir+'thumbnails_'+file_name,()=>{});
            let buf = await fs.readFileSync(upDir+file_name);
            await picture_now.update({md5:md5(buf)});
        }
    }
    else{
        let fileFormat = (files.file.name).split(".");
        let file_name = 'picture-' + Date.now() + '.' + fileFormat[fileFormat.length - 1];
        let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
        let image = images(files.file.path);
        let picture_now = await user_person.createPicture({
            name: ctx.request.body.name,
            file_name:file_name,
            size: files.file.size,
            image_size: image.width.toString() + '×' + image.height.toString(),
            image_type: files.file.type,
            url: 'http://118.89.197.156:8000/' + file_name,
            thumbnails_url:'http://118.89.197.156:8000/thumbnails_'+file_name,
            position:ctx.request.body.position,
            target:ctx.request.body.target
        });
        fs.rename(files.file.path, upDir + file_name, (err) => {
            console.log(err);
        });
        let adTypes = ctx.request.body.type;
        for(let j = 0; j < adTypes.length; j++){
            let adType = await ad_type.findOne({where:{name:adTypes[j]}});
            await picture_now.addAd_type(adType);
        }
        gm(upDir + file_name).resize(960,null).write(upDir+'thumbnails_'+file_name,()=>{});
        let buf = await fs.readFileSync(upDir+file_name);
        await picture_now.update({md5:md5(buf)});
    }
    ctx.api(200, {}, {code: 1, msg: '上传成功'});
    await next();
});

router.post('/action=get_picture', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let user_person_picture = await user_person.getPictures();
    let data = {};
    data.pictures = [];
    for (let i = 0; i < user_person_picture.length; ++i) {
        data.pictures[i] = {};
        data.pictures[i].id = user_person_picture[i].picture_id;
        data.pictures[i].src = user_person_picture[i].thumbnails_url;
    }
    ctx.api(200, data, {code: 1, msg: '获取图片成功！'});
    await next()
});

router.post('/action=add_pack', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let picture_id = ctx.request.body.picture_id;
    let picture_time = ctx.request.body.picture_time;
    let main = {}, picture_all = [];
    let resource_new = await resource.create({
        name: ctx.request.body.pack_name,
        remark: ctx.request.body.pack_note
    });
    await user_person.addResource(resource_new);
    for (let i = 0; i < picture_id.length; ++i) {
        let picture_add = await picture.findOne({where: {picture_id: picture_id[i]}});
        await resource_new.addPictures(picture_add);
        picture_all[i]={
            name:picture_add.name,
            md5:picture_add.md5,
            time:picture_time[i],
            url:picture_add.url,
            id:picture_add.picture_id
        }
    }
    main.picture = picture_all;
    let json_file = JSON.stringify(main);
    await fs.writeFileSync(upDir+resource_new.resource_id+'.json',json_file);
    let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
    resource_new.update({md5:md5(buf)});
    ctx.api(200, {}, {code: 1, msg: '创建资源包成功！'});
    await next();
});

router.post('/action=get_pack', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let person_resource = await user_person.getResources();
    let data = {};
    data.resources = [];
    for (let i = 0; i < person_resource.length; ++i) {
        let get_screen = await person_resource[i].getScreens();
        data.resources[i] = {
            'screen': get_screen,
            'name': person_resource[i].name,
            'note': person_resource[i].remark,
            'resource_id': person_resource[i].resource_id
        }
    }
    ctx.api(200, data, {code: 1, msg: '获取资源包成功！'});
    await next();
});

router.post('/action=get_pack_screen', async (ctx, next) => {
    let resource_now = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
    let resource_now_screen = await resource_now.getScreens();
    let data = {};
    data.screen = [];
    for (let i = 0; i < resource_now_screen.length; ++i) {
        data.screen[i] = {
            name: resource_now_screen[i].name,
            screen_id: resource_now_screen[i].screen_id,
            note: resource_now_screen[i].remark
        }
    }
    ctx.api(200, data, {code: 1, msg: '获取关联屏幕成功！'});
    await next();
});

router.post('/action=get_pack_no_screen', async (ctx, next) => {
    let resource_now = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
    let resource_now_screen = await resource_now.getScreens();
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    let user_person_screen = await user_person.getScreens();
    let data = {},n=0;
    data.screen = [];
    for(let i of user_person_screen){
        let flag=0;
        for(let j of resource_now_screen) if(i.screen_id===j.screen_id) flag=1;
        if(flag===0){
            data.screen[n]={
                name:i.name,
                screen_id:i.screen_id,
                note:i.remark
            };
            n++;
        }
    }
    ctx.api(200, data, {code: 1, msg: '获取未添加屏幕成功！'});
    await next();
});

router.post('/action=add_pack_screen', async (ctx, next) => {
    let screen_add = ctx.request.body.screen;
    let resource_add = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
    for (let i of screen_add) {
        let screen_new = await screen.findOne({where: {screen_id: i}});
        await resource_add.addScreens(screen_new);
        screen_new.update({md5:md5(Date.now())});
    }
    ctx.api(200, {}, {code: 1, msg: '添加屏幕成功！'});
    await next();
});

router.post('/action=del_pack_screen', async (ctx, next) => {
    let screen_del = ctx.request.body.screen;
    let resource_del = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
    for (let i of screen_del) {
        let screen_w = await screen.findOne({where: {screen_id: i}});
        await resource_del.removeScreens(screen_w);
        screen_w.update({md5:md5(Date.now())});
    }
    ctx.api(200, {}, {code: 1, msg: '删除屏幕成功！'});
    await next();
});

router.post('/action=get_pack_info', async (ctx, next) => {
    let resource_get = await resource.findOne({where: {resource_id: ctx.request.body.pack_id}});
    let resource_settings = JSON.parse(fs.readFileSync(upDir + resource_get.resource_id + '.json'));
    let data = {};
    data.used_pictures = resource_settings;
    data.name = resource_get.name;
    data.note = resource_get.remark;
    ctx.api(200, data, {code: 1, msg: '获取资源包图片成功！'});
    await next();
});

router.post('/action=modify_pack', async (ctx, next) => {
    if (ctx.request.body.multiple === true) {
        let pack = ctx.request.body.pack;
        for (let i of pack) {
            let resource_new = await resource.findOne({where: {resource_id: i}});
            resource_new.update({remark: ctx.request.body.new_pack_note});
            let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
            resource_new.update({md5:md5(buf)});
        }
        ctx.api(200, {}, {code: 1, msg: '批量修改备注成功！'});
    }
    else {
        let resource_new = await resource.findOne({where: {resource_id: ctx.request.body.pack[0]}});
        await fs.unlinkSync(upDir + resource_new.resource_id + '.json');
        await resource_new.update({
            name: ctx.request.body.new_pack_name,
            remark: ctx.request.body.new_pack_note
        });
        let del_pictures = await resource_new.getPictures();
        await resource_new.removePictures(del_pictures);
        let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
        let picture_id = ctx.request.body.picture_id;
        let picture_time = ctx.request.body.picture_time;
        let main = {}, picture_all = [];
        await user_person.addResource(resource_new);
        for (let i = 0; i < picture_id.length; ++i) {
            let picture_add = await picture.findOne({where: {picture_id: picture_id[i]}});
            await resource_new.addPictures(picture_add);
            picture_all[i]={
                name:picture_add.name,
                md5:picture_add.md5,
                time:picture_time[i],
                url:picture_add.url,
                id:picture_add.picture_id
            }
        }
        main.picture = picture_all;
        let json_file = JSON.stringify(main);
        await fs.writeFileSync(upDir+resource_new.resource_id+'.json',json_file);
        let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
        resource_new.update({md5:md5(buf)});
        ctx.api(200, {}, {code: 1, msg: '创建资源包成功！'});
    }
    await next();
});

router.post('/action=del_pack', async (ctx, next) => {
    for (let i = 0; i < ctx.request.body.pack.length; ++i) {
        let del_resource = await resource.findOne({where: {resource_id: ctx.request.body.pack[i]}});
        await fs.unlinkSync(upDir + del_resource.resource_id + '.json');
        let del_resource_picture = await del_resource.getPictures();
        await del_resource.removePictures(del_resource_picture);
        let screen_now = await del_resource.getScreens();
        for(let i of screen_now) await i.update({md5:md5(Date.now())});
        await del_resource.removeScreens(screen_now);
        await del_resource.destroy();
    }
    ctx.api(200, {}, {code: 1, msg: '删除成功！'});
    await next();
});

router.post('/action=modify_password',async(ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    if(user_person.password===ctx.request.body.old_password){
        user_person.update({
            password:ctx.request.body.new_password
        });
        ctx.api(200,{},{code:1,msg:'修改密码成功！'});
    }
    else{
        ctx.api(200,{},{code:0,msg:'密码错误！'});
    }
    await next();
});

router.post('/action=modify_user', async (ctx, next) => {
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    if (ctx.request.body.new_username !== undefined) await user_person.update({username: ctx.request.body.new_username});
    if (ctx.request.body.new_work_place !== undefined) await user_person.update({work_place: ctx.request.body.new_work_place});
    ctx.api(200, {}, {code: 1, msg: '修改信息成功！'});
    await next();
});

router.post('/action=get_picture_for_del',async(ctx,next)=>{
    let data={};
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let pictures_all = await user_person.getPictures();
    data.pictures = [];
    for(let i =0;i<pictures_all.length;++i){
        data.pictures[i]={
            id : pictures_all[i].picture_id,
            src : pictures_all[i].thumbnails_url
        };
        let pack_all = await pictures_all[i].getResources();
        data.pictures[i].pack = [];
        for(let j =0;j<pack_all.length;++j){
            data.pictures[i].pack[j] = pack_all[j].name;
        }
    }
    ctx.api(200,data,{code:1,msg:'获取图片成功！'});
    await next();
});

router.post('/action=get_images', async(ctx, next)=>{
    let data = {};
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let all_picture = await user_person.getPictures();
    for(let i of all_picture){
        let temp = {};
        temp = {
            name:i.name,
            src:i.thumbnails_url,
            target:i.target
        };
        let all_pack = await i.getResources();
        temp.pack = [];
        for(let j = 0;j<all_pack.length;++j){
            temp.pack[j] = all_pack[j].name;
        }
        data[i.id] = temp;
    }
    ctx.api(200,data,{code:1,msg:'获取图片列表成功！'});
    await next();
});

router.post('/action=modify_image_info', async(ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let image = await user_person.getPicture({where:{picture_id:ctx.request.body.id}});
    await image.update({
        name:ctx.request.new_name,
        target:ctx.request.body.new_target,
        position:ctx.request.body.new_position
    });
    ctx.api(200,{},{code:1,msg:'修改成功！'});
    await next();
});

router.post('/action=delete_image', async(ctx,next)=>{
    let del_images = ctx.request.body;
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    for(let i of del_images){
        let pic = await picture.findOne({where:{picture_id:i}});
        await fs.unlinkSync(upDir + pic.name);
        await fs.unlinkSync(upDir + 'thumbnails_'+pic.name);
        pic.destroy();
    }
    ctx.api(200,{},{code:1,msg:'删除成功！'});
    await next();
});

router.post('/action=del_picture',async(ctx,next)=>{
    let picture_ids = ctx.request.body.picture_id;
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    for(let i of picture_ids){
        let pic = await picture.findOne({where:{picture_id:i}});
        await fs.unlinkSync(upDir + pic.name);
        await fs.unlinkSync(upDir + 'thumbnails_'+pic.name);
        pic.destroy();
    }
    ctx.api(200,{},{code:1,msg:'删除成功！'});
    await next();
});

router.post('/action=create_screen',async(ctx,next)=>{
    let uuid = ctx.request.body.uuid;
    if(await screen.count({where:{uuid:uuid}})===0){
        await screen.create({
            uuid:uuid,
            md5:md5(Date.now()),
            name:uuid
        });
        ctx.api(200,{},{code:1,msg:'创建屏幕成功！'});
    }
    else ctx.api(200,{},{code:1,msg:'该屏幕已存在！'});
    await next();
});

router.post('/action=verify_screen',async(ctx,next)=>{
    let data = {};
    if(await screen.count({where:{uuid:ctx.request.body.uuid}})===0){
        data.is_user = 2;
    }
    else{
        let screen_now = await screen.findOne({where:{uuid:ctx.request.body.uuid}});
        if(screen_now.user_id===null){
            data.is_user = 0;
        }
        else{
            data.is_user = 1;
        }
    }
    ctx.api(200,data,{code:1,msg:'验证完成！'});
    await next();
});

router.post('/action=all',async(ctx,next)=>{
    let uuid = ctx.request.body.uuid;
    let data = {};
    let screen_now = await screen.findOne({where:{uuid:uuid}});
    await screen_now.update({updated_at:Date.now()});
    data.time = screen_now.time;
    if(screen_now.resource_id){
        let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
        data.json_url='http://118.89.197.156:8000/'+resource_now.resource_id+'.json';
        data.md5 = resource_now.md5;
    }
    ctx.api(200,data,{code:1,msg:'获取成功！'});
    await next();
});

router.post('/action=request',async(ctx,next)=>{
    let uuid = ctx.request.body.uuid;
    let screen_now = await screen.findOne({where:{uuid:uuid}});
    let data = {};
    await screen_now.update({updated_at:Date.now()});
    data.time = screen_now.time;
    if(screen_now.resource_id){
        let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
        data.md5 = resource_now.md5;
    }
    ctx.api(200,data,{code:1,msg:'轮询成功！'});
    await next();
});

router.post('/action=request_resource',async(ctx,next)=>{
    let uuid = ctx.request.body.uuid;
    let screen_now = await screen.findOne({where:{uuid:uuid}});
    let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
    let data={};
    await screen_now.update({updated_at:Date.now()});
    data.json_url = 'http://118.89.197.156:8000/'+resource_now.resource_id+'.json';
    ctx.api(200,data,{code:1,msg:'获取成功！'});
    await next();
});

router.post('/action=request_update',async (ctx,next)=>{
    if(ctx.request.body.version_code===3){
        ctx.api(200,{url:''},{code:1,msg:''});
    }
    else{
        ctx.api(200,{url:''},{code:1,msg:''});
    }
    await next();
});

router.post('/action=get_qrcode_info', async (ctx,next)=>{
    let body = ctx.request.body;
    feedback_info.create({
        browser:body.broswer,
        deviceType:body.deviceType,
        device:body.device,
        os:body.os,
        uuid:body.uuid,
        position:body.position,
        adType:body.adType,
        adId:body.adId,
        scanTime:body.scanTime
    });
    console.log(body);
    ctx.api(200,{},{code:1,msg:'获取信息成功！'});
    await next();
});

router.post('/action=add_adType', async (ctx, next)=>{
    let new_ad_type = ctx.request.body.new_adType;
    let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
    if (await ad_type.count({where:{name:new_ad_type}}) ===1){
        let ad_type_one = await ad_type.findOne({where:{name:new_ad_type}});
        if(await user_person.hasAd_type(ad_type_one)){
            ctx.api(200,{},{code:0, msg:'标签重复！'});
        }
        else{
            await user_person.addAd_type(ad_type_one);
            ctx.api(200,{},{code:1, msg:'创建成功！'});
        }
    }
    else{
        await user_person.createAd_type({
            name:new_ad_type
        });
        ctx.api(200,{},{code:1, msg:'创建成功！'});
    }
    await next();
});

router.post('/action=get_adType', async(ctx, next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let types = await user_person.getAd_types();
    let data = {
        adType:[]
    };
    let a = 0;
    if(types.length>0){
        for(let i of types){
            data.adType.push(i.name);
        }
    }
    ctx.api(200,data,{code:1, msg:'获取成功！'});
    await next();
});

router.post('/action=delete_adType', async(ctx, next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let adTypes = ctx.request.body;
    let flag = 0;
    let err = '';
    for (let i of adTypes){
        if(await ad_type.count({where:{name:i}}) > 0){
            let ad_type_one = await ad_type.findOne({where:{name:i}});
            await user_person.removeAd_type(ad_type_one);
        }
        else{
            flag = 1;
            err+=name;
            err+=' ';
        }
    }
    if(flag === 0){
        ctx.api(200, {}, {code:1,msg:'删除成功！'});
    }
    else{
        ctx.api(200, {}, {code:0,msg:'删除失败！'+err+'标签不存在！'});
    }
    await next();
});

// let myqr = require('./bsdiff');
// router.get('/action',async(ctx,next)=>{
//     let asd = await myqr('asdasd','asd.jpg','/home/lcr/');
//     console.log(asd);
//     await next();
// });
module.exports = router;