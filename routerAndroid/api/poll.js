/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:22
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
let screen = db.models.screen;
let resource = db.models.resource;

module.exports = (router)=>{
	//轮询
	router.post('/cloudExhibition/action=play_information',async(ctx,next)=>{
		let uuid = ctx.request.body.uuid;
		let screen_now = await screen.findOne({where:{uuid:uuid}});
		let data = {};
		await screen_now.update({updated_at:Date.now()});
		data.time = screen_now.time;
		if(screen_now.resource_id){
			let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
			data.md5 = resource_now.md5;
			data.auto_time = 0;
			data.time = screen_now.time;
		}
		lib.msgTranslate(ctx,200,data,{code:1,msg:'轮询成功！'});
		await next();
	});
};