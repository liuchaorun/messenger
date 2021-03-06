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
	let prefix = function (url){
		return `/screen${url}`;
	};
	router.post(prefix('/getAll'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let user_screen = await user_person.getScreens();
		let data = {};
		data.info = [];
		for (let i = 0; i < user_screen.length; ++i) {
			let resource_name = await resource.find({where:{resource_id:user_screen[i].resourceId}});
			data.info[i] = {
				uuid: user_screen[i].uuid,
				status: lib.isOnline(user_screen[i].updated_at, user_screen[i].time),
				name: user_screen[i].name,
				updateTime: user_screen[i].updated_at,
				freq: user_screen[i].time,
				pack: resource_name===null?'无':resource_name.name,
				note: user_screen[i].remark,
				screenResolution:user_screen[i].screen_resolution
			}
		}
		lib.msgTranslate(ctx,200, data, {code: 1, msg: "获取成功！"});
		await next();
	});

	router.post(prefix('/add'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let screen_num = await screen.count({where: {uuid: ctx.request.body.uuid}});
		if (screen_num === 0) {
			lib.msgTranslate(ctx,200, {}, {code: 6, msg: '不存在该屏幕！'});
		}
		else {
			let screen_new = await screen.find({where: {uuid: ctx.request.body.uuid}});
			await user_person.addScreen(screen_new);
			lib.msgTranslate(ctx,200, {}, {code: 1, msg: '添加成功！'});
		}
		await next();
	});

	router.post(prefix('/modify'), async (ctx, next) => {
		let screen_uuid = ctx.request.body.uuid;
		for (let i of screen_uuid) {
			let screen_new = await screen.find({where: {uuid: i}});
			if (ctx.request.body.newName !== undefined) await screen_new.update({name: ctx.request.body.newName});
			if (ctx.request.body.newFreq !== undefined) {
				await screen_new.update({
					time: ctx.request.body.newFreq,
					md5:md5(Date.now())
				});
			}
			if (ctx.request.body.newNote !== undefined) await screen_new.update({remark: ctx.request.body.newNote});
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改成功！'});
		await next();
	});

	router.post(prefix('/del'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let uuid = ctx.request.body.uuid;
		for (let i of uuid) {
			let screen_del = await screen.find({where: {uuid: i}});
			await user_person.removeScreen(screen_del);
			await screen_del.destroy();
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '删除成功！'});
		await next();
	});
};