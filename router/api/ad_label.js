/*
 * Created by liuchaorun
 * Date 18-5-16
 * Time 下午1:05
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const md5 = require('md5');
let user = db.models.user;
let resource = db.models.resource;
let ad_label = db.models.ad_label;
module.exports = (router)=>{
    let prefix = function (url){
        return `/label${url}`;
    };

    router.post(prefix('/add'), async (ctx, next)=>{
        let new_ad_label = ctx.request.body.newAdLabel;
        let user_person = await user.find({where: {email: ctx.session.custom_email}});
        if (await ad_label.count({where:{name:new_ad_label}}) ===1){
            let ad_label_one = await ad_label.find({where:{name:new_ad_label}});
            if(await user_person.hasAd_label(ad_label_one)){
                lib.msgTranslate(ctx,200,{},{code:0, msg:'标签重复！'});
            }
            else{
                await user_person.addAd_label(ad_label_one);
                lib.msgTranslate(ctx,200,{},{code:1, msg:'创建成功！'});
            }
        }
        else{
            await user_person.createAd_label({
                name:new_ad_label
            });
            lib.msgTranslate(ctx,200,{},{code:1, msg:'创建成功！'});
        }
        await next();
    });

    router.post(prefix('/get'), async(ctx, next)=>{
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        let labels = await user_person.getAd_labels();
        let data = {
            adLabel:[]
        };
        if(labels.length>0){
            for(let i of labels){
                data.adLabel.push(i.name);
            }
        }
        lib.msgTranslate(ctx,200,data,{code:1, msg:'获取成功！'});
        await next();
    });

    router.post(prefix('/del'), async(ctx, next)=>{
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        let adLabels = ctx.request.body;
        let flag = 0;
        let err = '';
        for (let i of adLabels){
            if(await ad_label.count({where:{name:i}}) > 0){
                let ad_label_one = await ad_label.find({where:{name:i}});
                let ad_num = await ad_label_one.getAds();
                if(ad_num.length>0){
                    lib.msgTranslate(ctx,200,{},{code:9,msg:'无法删除！已绑定图片，请先解除绑定！'});
                }
                else{
                    await user_person.removeAd_label(ad_label_one);
                }
            }
            else{
                flag = 1;
                err+=name;
                err+=' ';
            }
        }
        if(flag === 0){
            lib.msgTranslate(ctx,200, {}, {code:1,msg:'删除成功！'});
        }
        else if(flag===1){
            lib.msgTranslate(ctx,200, {}, {code:10,msg:'删除失败！'+err+'标签不存在！'});
        }
        await next();
    });
};