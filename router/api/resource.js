/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午1:05
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const md5 = require('md5');
const images = require("image-size");
const gm = require('gm');
let user = db.models.user;
let ad_label = db.models.ad_label;
module.exports = (router)=>{
	router.post('/action=add_pack', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let picture_id = ctx.request.body.picture_id;
		let picture_time = ctx.request.body.picture_time;
		let main = {}, picture_all = [];
		let resource_new = await resource.create({
			name: ctx.request.body.pack_name,
			remark: ctx.request.body.pack_note
		});
		await user_person.addResource(resource_new);
		for (let i = 0; i < picture_id.length; ++i) {
			let picture_add = await picture.findOne({where: {picture_id: picture_id[i]}});
			await resource_new.addPictures(picture_add);
			picture_all[i]={
				picture_name:picture_add.name,
				picture_md5:picture_add.md5,
				picture_time:picture_time[i],
				picture_url:picture_add.url,
				picture_id:picture_add.picture_id,
				qrcode:0,
				qrcode_position:picture_add.position
			}
		}
		main.picture = picture_all;
		let json_file = JSON.stringify(main);
		await fs.writeFileSync(upDir+resource_new.resource_id+'.json',json_file);
		let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
		resource_new.update({md5:md5(buf)});
		ctx.api(200, {}, {code: 1, msg: '创建资源包成功！'});
		await next();
	});

	router.post('/action=get_pack', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let person_resource = await user_person.getResources();
		let data = {};
		data.resources = [];
		for (let i = 0; i < person_resource.length; ++i) {
			let get_screen = await person_resource[i].getScreens();
			data.resources[i] = {
				'screen': get_screen,
				'name': person_resource[i].name,
				'note': person_resource[i].remark,
				'resource_id': person_resource[i].resource_id
			}
		}
		ctx.api(200, data, {code: 1, msg: '获取资源包成功！'});
		await next();
	});

	router.post('/action=get_pack_screen', async (ctx, next) => {
		let resource_now = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
		let resource_now_screen = await resource_now.getScreens();
		let data = {};
		data.screen = [];
		for (let i = 0; i < resource_now_screen.length; ++i) {
			data.screen[i] = {
				name: resource_now_screen[i].name,
				screen_id: resource_now_screen[i].screen_id,
				note: resource_now_screen[i].remark
			}
		}
		ctx.api(200, data, {code: 1, msg: '获取关联屏幕成功！'});
		await next();
	});

	router.post('/action=get_pack_no_screen', async (ctx, next) => {
		let resource_now = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
		let resource_now_screen = await resource_now.getScreens();
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let user_person_screen = await user_person.getScreens();
		let data = {},n=0;
		data.screen = [];
		for(let i of user_person_screen){
			let flag=0;
			for(let j of resource_now_screen) if(i.screen_id===j.screen_id) flag=1;
			if(flag===0){
				data.screen[n]={
					name:i.name,
					screen_id:i.screen_id,
					note:i.remark
				};
				n++;
			}
		}
		ctx.api(200, data, {code: 1, msg: '获取未添加屏幕成功！'});
		await next();
	});

	router.post('/action=add_pack_screen', async (ctx, next) => {
		let screen_add = ctx.request.body.screen;
		let resource_add = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
		for (let i of screen_add) {
			let screen_new = await screen.findOne({where: {screen_id: i}});
			await resource_add.addScreens(screen_new);
			screen_new.update({md5:md5(Date.now())});
		}
		ctx.api(200, {}, {code: 1, msg: '添加屏幕成功！'});
		await next();
	});

	router.post('/action=del_pack_screen', async (ctx, next) => {
		let screen_del = ctx.request.body.screen;
		let resource_del = await resource.findOne({where: {resource_id: ctx.request.body.resource_id}});
		for (let i of screen_del) {
			let screen_w = await screen.findOne({where: {screen_id: i}});
			await resource_del.removeScreens(screen_w);
			screen_w.update({md5:md5(Date.now())});
		}
		ctx.api(200, {}, {code: 1, msg: '删除屏幕成功！'});
		await next();
	});

	router.post('/action=get_pack_info', async (ctx, next) => {
		let resource_get = await resource.findOne({where: {resource_id: ctx.request.body.pack_id}});
		let resource_settings = JSON.parse(fs.readFileSync(upDir + resource_get.resource_id + '.json'));
		let data = {};
		data.used_pictures = resource_settings;
		data.name = resource_get.name;
		data.note = resource_get.remark;
		ctx.api(200, data, {code: 1, msg: '获取资源包图片成功！'});
		await next();
	});

	router.post('/action=modify_pack', async (ctx, next) => {
		if (ctx.request.body.multiple === true) {
			let pack = ctx.request.body.pack;
			for (let i of pack) {
				let resource_new = await resource.findOne({where: {resource_id: i}});
				resource_new.update({remark: ctx.request.body.new_pack_note});
				let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
				resource_new.update({md5:md5(buf)});
			}
			ctx.api(200, {}, {code: 1, msg: '批量修改备注成功！'});
		}
		else {
			let resource_new = await resource.findOne({where: {resource_id: ctx.request.body.pack[0]}});
			await fs.unlinkSync(upDir + resource_new.resource_id + '.json');
			await resource_new.update({
				name: ctx.request.body.new_pack_name,
				remark: ctx.request.body.new_pack_note
			});
			let del_pictures = await resource_new.getPictures();
			await resource_new.removePictures(del_pictures);
			let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
			let picture_id = ctx.request.body.picture_id;
			let picture_time = ctx.request.body.picture_time;
			let main = {}, picture_all = [];
			await user_person.addResource(resource_new);
			for (let i = 0; i < picture_id.length; ++i) {
				let picture_add = await picture.findOne({where: {picture_id: picture_id[i]}});
				await resource_new.addPictures(picture_add);
				picture_all[i]={
					picture_name:picture_add.name,
					picture_md5:picture_add.md5,
					picture_time:picture_time[i],
					picture_url:picture_add.url,
					picture_id:picture_add.picture_id,
					qrcode:0,
					qrcode_position:picture_add.position
				}
			}
			main.picture = picture_all;
			let json_file = JSON.stringify(main);
			await fs.writeFileSync(upDir+resource_new.resource_id+'.json',json_file);
			let buf = await fs.readFileSync(upDir+resource_new.resource_id+'.json');
			resource_new.update({md5:md5(buf)});
			ctx.api(200, {}, {code: 1, msg: '修改资源包成功！'});
		}
		await next();
	});

	router.post('/action=del_pack', async (ctx, next) => {
		for (let i = 0; i < ctx.request.body.pack.length; ++i) {
			let del_resource = await resource.findOne({where: {resource_id: ctx.request.body.pack[i]}});
			await fs.unlinkSync(upDir + del_resource.resource_id + '.json');
			let del_resource_picture = await del_resource.getPictures();
			await del_resource.removePictures(del_resource_picture);
			let screen_now = await del_resource.getScreens();
			for(let i of screen_now) await i.update({md5:md5(Date.now())});
			await del_resource.removeScreens(screen_now);
			await del_resource.destroy();
		}
		ctx.api(200, {}, {code: 1, msg: '删除成功！'});
		await next();
	});
};