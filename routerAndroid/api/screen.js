/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:09
 **/
const md5 = require('md5');
const db = require('../../db/index');
const lib = require('../../lib/lib');
let screen = db.models.screen;
module.exports = (router)=>{
	//创建屏幕
	router.post('/create_screen',async(ctx,next)=>{
		let uuid = ctx.request.body.uuid;
		if(await screen.count({where:{uuid:uuid}})===0){
			await screen.create({
				uuid:uuid,
				md5:md5(Date.now()),
				name:uuid
			});
			lib.msgTranslate(ctx,200,{},{code:1,msg:'创建屏幕成功！'});
		}
		else lib.msgTranslate(ctx,200,{},{code:1,msg:'该屏幕已存在！'});
		await next();
	});

	//验证屏幕
	router.post('/cloudExhibition/action=check_bind',async(ctx,next)=>{
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
		lib.msgTranslate(ctx,200,data,{code:1,msg:'验证完成！'});
		await next();
	});
};