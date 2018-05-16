/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:48
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const md5 = require('md5');
let user = db.models.user;
let screen = db.models.screen;
let resource = db.models.resource;
module.exports = (router)=>{
	router.post('/action=get_screen', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let user_screen = await user_person.getScreens();
		let data = {};
		data.info = [];
		for (let i = 0; i < user_screen.length; ++i) {
			let resource_name = await resource.findOne({where:{resource_id:user_screen[i].resource_id}});
			data.info[i] = {
				uuid: user_screen[i].uuid,
				status: lib.isOnline(user_screen[i].updated_at, user_screen[i].time),
				name: user_screen[i].name,
				update_time: user_screen[i].updated_at,
				freq: user_screen[i].time,
				pack: resource_name===null?'无':resource_name.name,
				note: user_screen[i].remark
			}
		}
		lib.msgTranslate(ctx,200, data, {code: 1, msg: "获取成功！"});
		await next();
	});

	router.post('/action=add_screen', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let screen_num = await screen.count({where: {uuid: ctx.request.body.uuid}});
		if (screen_num === 0) {
			lib.msgTranslate(200, {}, {code: 0, msg: '不存在该屏幕！'});
		}
		else {
			let screen_new = await screen.findOne({where: {uuid: ctx.request.body.uuid}});
			await user_person.addScreen(screen_new);
			lib.msgTranslate(200, {}, {code: 1, msg: '添加成功！'});
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
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改成功！'});
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
		lib.msgTranslate(200, {}, {code: 1, msg: '删除成功！'});
		await next();
	});
};