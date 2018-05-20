/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:36
 **/
const db = require('../../db/index');
const lib = require('../../lib/lib');
let user = db.models.user;

module.exports = (router)=>{
	router.post('/signup', async (ctx, next) => {
		let user_num = await user.count({where: {email: ctx.request.body.email}});
		let n = Math.floor(Math.random() * 9000 + 1000);
		ctx.session.verify = n.toString();
		if (user_num === 1) {
			lib.msgTranslate(ctx,200, {}, {code: 2, msg: '该用户已存在'});
		}
		else {
			let mailOptions = {
				from: '"Messenger" <pobooks@126.com>',
				to: ctx.request.body.email,
				subject: 'Messenger',
				text: 'Messenger 注册验证码:' + ctx.session.verify,
			};
			lib.transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message %s sent: %s', info.messageId, info.response);
			});
			lib.msgTranslate(ctx,200, {}, {code: 1, msg: '验证码已下发'});
		}
		await next();
	});

	router.post('/verify', async (ctx, next) => {
		if (ctx.session.verify === ctx.request.body.verify) {
			await user.create({
				username: ctx.request.body.username,
				email: ctx.request.body.email,
				password: ctx.request.body.password
			});
			lib.msgTranslate(ctx,200, {}, {code: 1, msg: '注册成功！'});
		}
		else lib.msgTranslate(ctx,200, {}, {code: 3, msg: '验证码错误！'});
		await next();
	});
};