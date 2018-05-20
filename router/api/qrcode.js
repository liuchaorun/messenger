/*
 * Created by liuchaorun
 * Date 18-5-16
 * Time 下午12:45
 **/
const db = require('../../db/index');
let feedback_info = db.models.feedback_info;
module.exports = (router)=>{
    router.post('/getQrcodeInfo', async (ctx,next)=>{
        let body = ctx.request.body;
        await feedback_info.create({
            browser:body.browser,
            device_type:body.deviceType,
            device:body.device,
            os:body.os,
            uuid:body.uuid,
            position:body.position,
            ad_type:body.adLabel,
            ad_id:body.adId,
            scan_time:body.scanTime,
            ip:ctx.request.ip
        });
        ctx.redirect(body.target);
        await next();
    });
};