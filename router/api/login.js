/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:41
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const md5 = require('md5');
let user = db.models.user;
module.exports = (router)=>{
	router.post('/login', async (ctx, next) => {
		let user_num = await user.count({where: {email: ctx.request.body.email}});
		if (user_num === 0) lib.msgTranslate(ctx,200, {}, {code: 5, msg: '该用户不存在！'});
		else {
			if (ctx.cookies.get('user', {}) === undefined) {
				let user_person = await user.findOne({where: {email: ctx.request.body.email}});
				if (user_person.password === ctx.request.body.password) {
					ctx.session.custom_email = user_person.email;
					let data = {};
					data.username = user_person.username;
					let md = md5(ctx.session.custom_email);
					ctx.cookies.set(
						'user',
						md,
						{
							domain: '118.89.197.156:3000',  // 写cookie所在的域名
							path: '/',       // 写cookie所在的路径
							maxAge: 60 * 60 * 24 * 30 * 1000, // cookie有效时长
							httpOnly: true,  // 是否只用于http请求中获取
							overwrite: true  // 是否允许重写
						}
					);
					ctx.session.last_login_time = user_person.last_login_time;
					await user_person.update({
						last_login_time: Date.now(),
					});
					lib.msgTranslate(ctx,200, data, {code: 1, msg: '登录成功！'});
				}
				else{
					lib.msgTranslate(ctx,200,{},{code:4,msg:'密码错误！'});
				}
			}
			else {
				let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
				ctx.session.last_login_time = user_person.last_login_time;
				await user_person.update({
					last_login_time: Date.now(),
				});
				let data = {};
				data.username = user_person.username;
				data.email = user_person.email;
				lib.msgTranslate(ctx,200, data, {code: 1, msg: '登录成功！'});
			}
		}
		await next();
	});
};