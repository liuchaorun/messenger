/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:24
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const fs = require('fs');
let screen = db.models.screen;
let resource = db.models.resource;
let ad = db.models.ad;
module.exports = (router)=>{
	//请求二维码
	router.post('get_qrcode',async(ctx,next)=>{
		let uuid = ctx.request.body.uuid;
		let screen_now = await screen.findOne({where:{uuid:uuid}});
		let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
		let ad_now = await ad.findOne(({where:{ad_id:ctx.request.body.ad_id}}));
		let qrcode_name = 'qrcode-' + Date.now() + '.png';
		let data = {};
		let ad_labels = await ad_now.getAd_labels();
		let ad = ' ';
		for (let i of ad_labels){
			ad+=i.name;
		}
		await lib.create_qrcode('http://118.89.197.156:3000/qrcode.html?'+'uuid='+uuid+'&adType='+encodeURI(ad)+'&adId='+ad_now.ad_id+'&target='+ad_now.target,qrcode_name,'/home/ubuntu/file/qrcode/');
		data.qr_url = 'http://118.89.197.156:8000/'+qrcode_name;
		let buf = await fs.readFileSync(config.upDir+resource_now.resource_id+'.json');
		let main = JSON.parse(buf);
		for(let i of main){
			if(i.ad_id === ad_now.ad_id){
				i.qr_url = 'http://118.89.197.156:8000/'+qrcode_name;
			}
		}
		lib.msgTranslate(ctx,200,data,{code:1,msg:'获取成功！'});
		await next();
	});
};