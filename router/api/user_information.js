/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:45
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
let user = db.models.user;
module.exports = (router)=>{
	router.post('/action=forget', async (ctx, next) => {
		let user_num = await user.count({where: {email: ctx.request.body.email}});
		if (user_num === 0) lib.msgTranslate(ctx,200, {}, {code: 0, msg: '不存在该用户！'});
		else {
			let user_person = await user.findOne({where: {email: ctx.request.body.email}});
			if (user_person.username === ctx.request.body.username) {
				ctx.session.forget_email = ctx.request.body.email;
				lib.msgTranslate(ctx,200, {}, {code: 1, msg: '验证成功！'});
			}
			else {
				lib.msgTranslate(ctx,200, {}, {code: 0, msg: '用户名错误！'});
			}
		}
		await next();
	});

	router.post('/action=new_password', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.forget_email}});
		await user_person.update({
			password: ctx.request.body.new_password
		});
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改密码成功！'});
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
		lib.msgTranslate(200, data, {code: 1, msg: '获取信息成功'});
		await next();
	});
};