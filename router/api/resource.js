/*
 * Created by liuchaorun
 * Date 18-5-16
 * Time 下午1:05
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const md5 = require('md5');
let user = db.models.user;
let resource = db.models.resource;
let ad = db.models.ad;
module.exports = (router)=>{
	let prefix = function (url){
		return `/resource${url}`;
	};

	router.post(prefix('/add'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let ad_id = ctx.request.body.adId;
		let ad_time = ctx.request.body.adTime;
		let main = {}, ad_all = [];
		let resource_new = await resource.create({
			name: ctx.request.body.packName,
			remark: ctx.request.body.packNote
		});
		await user_person.addResource(resource_new);
		for (let i = 0; i < ad_id.length; ++i) {
			let ad_add = await ad.find({where: {picture_id: ad_id[i]}});
			await resource_new.addAds(ad_add);
			ad_all[i]={
				ad_name:ad_add.name,
				ad_md5:ad_add.md5,
				ad_time:ad_time[i],
				ad_url:ad_add.url,
				ad_id:ad_add.ad_id,
				ad_target:ad_add.target,
				ad_qrcode_position:ad_add.position,
				ad_type:ad_add.ad_type,
				ad_qrcode_update:0
			}
		}
		main.ad = ad_all;
		let json_file = JSON.stringify(main);
		await fs.writeFileSync(config.upDir+resource_new.resource_id+'.json',json_file);
		let buf = await fs.readFileSync(config.upDir+resource_new.resource_id+'.json');
		resource_new.update({md5:md5(buf)});
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '创建资源包成功！'});
		await next();
	});

	router.post(prefix('/get'), async (ctx, next) => {
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let person_resource = await user_person.getResources();
		let data = {};
		data.resources = [];
		for (let i = 0; i < person_resource.length; ++i) {
			let get_screen = await person_resource[i].getScreens();
			data.resources[i] = {
				screen: get_screen,
				name: person_resource[i].name,
				note: person_resource[i].remark,
				resourceId: person_resource[i].resource_id
			}
		}
		lib.msgTranslate(ctx, 200, data, {code: 1, msg: '获取资源包成功！'});
		await next();
	});

	router.post(prefix('getPackScreen'), async (ctx, next) => {
		let resource_now = await resource.find({where: {resource_id: ctx.request.body.resourceId}});
		let resource_now_screen = await resource_now.getScreens();
		let data = {};
		data.screen = [];
		for (let i = 0; i < resource_now_screen.length; ++i) {
			data.screen[i] = {
				name: resource_now_screen[i].name,
				screenId: resource_now_screen[i].screen_id,
				note: resource_now_screen[i].remark
			}
		}
		lib.msgTranslate(ctx,200, data, {code: 1, msg: '获取关联屏幕成功！'});
		await next();
	});

	router.post(prefix('/getPackNoScreen'), async (ctx, next) => {
		let resource_now = await resource.find({where: {resource_id: ctx.request.body.resourceId}});
		let resource_now_screen = await resource_now.getScreens();
		let user_person = await user.find({where: {email: ctx.session.custom_email}});
		let user_person_screen = await user_person.getScreens();
		let data = {},n=0;
		data.screen = [];
		for(let i of user_person_screen){
			let flag=0;
			for(let j of resource_now_screen) if(i.screen_id===j.screen_id) flag=1;
			if(flag===0){
				data.screen[n]={
					name:i.name,
					screenId:i.screen_id,
					note:i.remark
				};
				n++;
			}
		}
		lib.msgTranslate(ctx,200, data, {code: 1, msg: '获取未添加屏幕成功！'});
		await next();
	});

	router.post(prefix('/addPackScreen'), async (ctx, next) => {
		let screen_add = ctx.request.body.screen;
		let resource_add = await resource.find({where: {resource_id: ctx.request.body.resourceId}});
		for (let i of screen_add) {
			let screen_new = await screen.find({where: {screen_id: i}});
			await resource_add.addScreens(screen_new);
			await screen_new.update({md5:md5(Date.now())});
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '添加屏幕成功！'});
		await next();
	});

	router.post(prefix('/delPackScreen'), async (ctx, next) => {
		let screen_del = ctx.request.body.screen;
		let resource_del = await resource.find({where: {resource_id: ctx.request.body.resourceId}});
		for (let i of screen_del) {
			let screen_w = await screen.find({where: {screen_id: i}});
			await resource_del.removeScreens(screen_w);
			await screen_w.update({md5:md5(Date.now())});
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '删除屏幕成功！'});
		await next();
	});

	router.post(prefix('/getPackInfo'), async (ctx, next) => {
		let resource_get = await resource.find({where: {resource_id: ctx.request.body.resourceId}});
		let resource_settings = JSON.parse(fs.readFileSync(config.upDir + resource_get.resource_id + '.json'));
		let data = {};
		data.usedAds = resource_settings;
		data.name = resource_get.name;
		data.note = resource_get.remark;
		lib.msgTranslate(ctx,200, data, {code: 1, msg: '获取资源包图片成功！'});
		await next();
	});

	router.post(prefix('/modify'), async (ctx, next) => {
		if (ctx.request.body.multiple === true) {
			let pack = ctx.request.body.pack;
			for (let i of pack) {
				let resource_new = await resource.find({where: {resource_id: i}});
				await resource_new.update({remark: ctx.request.body.newPackNote});
				let buf = await fs.readFileSync(config.upDir+resource_new.resource_id+'.json');
				await resource_new.update({md5:md5(buf)});
			}
			lib.msgTranslate(ctx,200, {}, {code: 1, msg: '批量修改备注成功！'});
		}
		else {
			let resource_new = await resource.find({where: {resource_id: ctx.request.body.pack[0]}});
			await fs.unlinkSync(config.upDir + resource_new.resource_id + '.json');
			await resource_new.update({
				name: ctx.request.body.newPackName,
				remark: ctx.request.body.newPackNote
			});
			let del_pictures = await resource_new.getAds();
			await resource_new.removeAds(del_pictures);
			let user_person = await user.find({where: {email: ctx.session.custom_email}});
			let ad_id = ctx.request.body.adId;
			let ad_time = ctx.request.body.adTime;
			let main = {}, ad_all = [];
			await user_person.addResource(resource_new);
			for (let i = 0; i < ad_id.length; ++i) {
				let ad_add = await ad.find({where: {picture_id: ad_id[i]}});
				await resource_new.addAds(ad_add);
				ad_all[i]={
                    ad_name:ad_add.name,
                    ad_md5:ad_add.md5,
                    ad_time:ad_time[i],
                    ad_url:ad_add.url,
                    ad_id:ad_add.ad_id,
                    ad_target:ad_add.target,
                    ad_qrcode_position:ad_add.position,
                    ad_type:ad_add.ad_type,
					ad_qrcode_update:0
				}
			}
			main.ad = ad_all;
			let json_file = JSON.stringify(main);
			await fs.writeFileSync(config.upDir+resource_new.resource_id+'.json',json_file);
			let buf = await fs.readFileSync(config.upDir+resource_new.resource_id+'.json');
			await resource_new.update({md5:md5(buf)});
			lib.msgTranslate(ctx,200, {}, {code: 1, msg: '修改资源包成功！'});
		}
		await next();
	});

	router.post(prefix('/del'), async (ctx, next) => {
		for (let i = 0; i < ctx.request.body.pack.length; ++i) {
			let del_resource = await resource.find({where: {resource_id: ctx.request.body.pack[i]}});
			await fs.unlinkSync(config.upDir + del_resource.resource_id + '.json');
			let del_resource_ad = await del_resource.getAds();
			await del_resource.removeAds(del_resource_ad);
			let screen_now = await del_resource.getScreens();
			for(let i of screen_now) await i.update({md5:md5(Date.now())});
			await del_resource.removeScreens(screen_now);
			await del_resource.destroy();
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '删除成功！'});
		await next();
	});
};