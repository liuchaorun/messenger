/**
 * Created by lcr on 17-3-25.
 */
Array.prototype.removeByValue = function(val) {
    for(let i=0; i<this.length; i++) {
        if(this[i] === val) {
            this.splice(i, 1);
            break;
        }
    }
};
const md5 = require('md5');
const router = require('koa-router')();
const koaBody = require('koa-body');
const model = require('../db/model');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');

const isOnline = require('../lib/isOnlie');
const fs = require('fs');


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
            target:i.target,
            position:i.position
        };
        let all_pack = await i.getResources();
        temp.pack = [];
        for(let j = 0;j<all_pack.length;++j){
            temp.pack[j] = all_pack[j].name;
        }
        let types = await i.getAd_types();
        temp.adType = [];
        if(types.length>0){
            for(let j of types){
                temp.adType.push(j.name);
            }
        }
        data[i.picture_id] = temp;
    }
    ctx.api(200,data,{code:1,msg:'获取图片列表成功！'});
    await next();
});

router.post('/action=modify_image_info', async(ctx,next)=>{
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let image = await user_person.getPictures({where:{picture_id:ctx.request.body.id}});
    if(image[0].target !== ctx.request.body.new_target){
        let buf = await fs.readFileSync(upDir+resource_now.resource_id+'.json');
        let main = JSON.parse(buf);
        for(let i of main){
            if(i.picture_id === picture_now.picture_id){
                i.qrcode = 1;
            }
        }
    }
    await image[0].update({
        name:ctx.request.body.new_name,
        target:ctx.request.body.new_target,
        position:ctx.request.body.new_position
    });
    let new_adType = ctx.request.body.new_adType;
    let old_adType = await image[0].getAd_types();
    for(let i of old_adType){
        let flag = 0;
        for(let j of new_adType){
            if(i.name === j){
                flag = 1;
                break;
            }
        }
        if(flag === 0){
            image[0].removeAd_type(i);
        }
        else{
            new_adType.removeByValue(i.name);
        }
    }
    if(new_adType.length>0){
        for(let i of new_adType){
            let t = await ad_type.findOne({where:{name:i}});
            await image[0].addAd_type(t);
        }
    }
    ctx.api(200,{},{code:1,msg:'修改成功！'});
    await next();
});

router.post('/action=delete_image', async(ctx,next)=>{
    let del_images = ctx.request.body;
    let user_person = await user.findOne({where:{email:ctx.session.custom_email}});
    let err = '';
    let flag = 0;
    for(let i of del_images){
        let pic = await picture.findOne({where:{picture_id:i}});
        let resource_all = await pic.getResources();
        if(resource_all.length>0){
            err = err + pic.name + ' ';
            flag = 1;
        }
        else{
            let types = await pic.getAd_types();
            await pic.removeAd_types(types);
            await fs.unlinkSync(upDir + pic.file_name);
            await fs.unlinkSync(upDir + 'thumbnails_'+pic.file_name);
            await pic.destroy();
        }
    }
    if(flag === 0){
        ctx.api(200,{},{code:1,msg:'删除成功！'});
    }
    else{
        ctx.api(200,{},{code:0,msg:err+'删除失败！'});
    }
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


router.post('/action=get_qrcode_info', async (ctx,next)=>{
    let body = ctx.request.body;
    await feedback_info.create({
        browser:body.browser,
        device_type:body.deviceType,
        device:body.device,
        os:body.os,
        uuid:body.uuid,
        position:body.position,
        ad_type:body.adType,
        ad_id:body.adId,
        scan_time:body.scanTime,
        ip:ctx.request.ip
    });

    ctx.redirect(body.target);
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
            let picture_num = await ad_type_one.getPictures();
            if(picture_num.length>0){
                ctx.api(200,{},{code:0,msg:'无法删除！已绑定图片，请先解除绑定！'});
            }
            else{
                await user_person.removeAd_type(ad_type_one);
            }
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
    else if(flag===1){
        ctx.api(200, {}, {code:0,msg:'删除失败！'+err+'标签不存在！'});
    }
    await next();
});

module.exports = router;