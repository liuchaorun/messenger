/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:19
 **/
const db = require('../../db/index');
const lib = require('../../lib/lib');
let resource = db.models.resource;
let screen = db.models.screen;
module.exports = (router)=>{
	//请求json文件
	router.post('/get_json',async(ctx,next)=>{
		let uuid = ctx.request.body.uuid;
		let data = {};
		let screen_now = await screen.findOne({where:{uuid:uuid}});
		await screen_now.update({updated_at:Date.now()});
		data.time = screen_now.time;
		if(screen_now.resource_id){
			let resource_now = await resource.findOne({where:{resource_id:screen_now.resource_id}});
			data.json_url='http://118.89.197.156:8000/'+resource_now.resource_id+'.json';
		}
		lib.msgTranslate(ctx,200,data,{code:1,msg:'获取成功！'});
		await next();
	});
};