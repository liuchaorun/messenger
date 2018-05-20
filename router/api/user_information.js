/*
 * Created by liuchaorun
 * Date 18-5-16
 * Time 下午12:45
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
let user = db.models.user;
module.exports = (router)=>{
	let prefix = function (url){
		return `/user${url}`;
	};
	//忘记密码验证
	router.post(prefix('/forget'), async (ctx, next) => {
		let user_num = await user.count({where: {email: ctx.request.body.email}});
		if (user_num === 0) lib.msgTranslate(ctx,200, {}, {code: 0, msg: '不存在该用户！'});
		else {
			let user_person = await user.find({where: {email: ctx.request.body.email}});
			if (user_person.username === ctx.request.body.username) {
				ctx.session.forget_email = ctx.request.body.email;
				lib.msgTranslate(ctx,200, {}, {code: 1, msg: '验证成功！'});
			}
			else {
				lib.msgTranslate(ctx,200, {}, {code: 5, msg: '用户名错误！'});
			}
		}
		await next();
	});
	//重置新密码
	router.post(prefix('/newPassword'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.forget_email}});
		await user_person.update({
			password: ctx.request.body.new_password
		});
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改密码成功！'});
		await next();
	});
	//获取信息
	router.post(prefix('/getInfo'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let user_ad = await user_person.getAds();
		let user_screen = await user_person.getScreens();
		let data = {};
		data.username = user_person.username;
		data.email = user_person.email;
		data.workPlace = user_person.work_place;
		data.lastLoginTime = ctx.session.last_login_time;
		data.adNum = user_ad.length;
		data.screenNum = user_screen.length;
		lib.msgTranslate(200, data, {code: 1, msg: '获取信息成功'});
		await next();
	});
	//重置密码
    router.post(prefix('/modifyPassword'),async(ctx,next)=>{
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        if(user_person.password===ctx.request.body.oldPassword){
            user_person.update({
                password:ctx.request.body.newPassword
            });
            lib.msgTranslate(ctx,200,{},{code:1,msg:'修改密码成功！'});
        }
        else{
            lib.msgTranslate(ctx,200,{},{code:4,msg:'密码错误！'});
        }
        await next();
    });
	//修改用户信息
    router.post(prefix('/modifyUser'), async (ctx, next) => {
        let user_person = await user.find({where: {email: ctx.session.custom_email}});
        if (ctx.request.body.newUsername !== undefined) await user_person.update({username: ctx.request.body.newUsername});
        if (ctx.request.body.newWorkPlace !== undefined) await user_person.update({work_place: ctx.request.body.newWorkPlace});
        lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改信息成功！'});
        await next();
    });
};