/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:54
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
	router.post('/action=upload', koaBody({
		multipart: true,
		formidable: {
			uploadDir: config.upDir
		}
	}), async (ctx, next) => {
		let files = ctx.request.body.files;
		if(files.file.name === undefined){
			for (let i = 0; i < files.file.length; ++i) {
				let fileFormat = (files.file[i].name).split(".");
				let file_name = 'picture-' + Date.now() + '.' + fileFormat[fileFormat.length - 1];
				let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
				let image = images(files.file[i].path);
				let ad_now = await user_person.createAd({
					name:ctx.request.body.fields.name + i.toString(),
					file_name:file_name,
					size: files.file[i].size,
					ad_size: image.width.toString() + '×' + image.height.toString(),
					ad_type:0,
					file_type: files.file[i].type,
					url: 'http://118.89.197.156:8000/' + file_name,
					thumbnails_url:'http://118.89.197.156:8000/thumbnails_'+file_name,
					position:ctx.request.body.fields.position,
					target:ctx.request.body.fields.target
				});
				fs.rename(files.file[i].path, config.upDir + file_name, (err) => {
					console.log(err);
				});
				let adLabels = [];
				let elements = '';
				for(let i of ctx.request.body.fields.type){
					if(i===','){
						adLabels.push(elements);
						elements = '';
					}
					else{
						elements += i;
					}
				}
				adLabels.push(elements);
				for(let j of adLabels){
					let adType = await ad_label.findOne({where:{name:j}});
					await ad_now.addAd_label(adType);
				}
				gm(config.upDir + file_name).resize(null,200).write(config.upDir+'thumbnails_'+file_name,()=>{});
				let buf = await fs.readFileSync(config.upDir+file_name);
				await ad_now.update({md5:md5(buf)});
			}
		}
		else{
			let fileFormat = (files.file.name).split(".");
			let file_name = 'picture-' + Date.now() + '.' + fileFormat[fileFormat.length - 1];
			let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
			let image = images(files.file.path);
			let ad_now = await user_person.createAd({
				name:ctx.request.body.fields.name + i.toString(),
				file_name:file_name,
				size: files.file[i].size,
				ad_size: image.width.toString() + '×' + image.height.toString(),
				ad_type:0,
				file_type: files.file[i].type,
				url: 'http://118.89.197.156:8000/' + file_name,
				thumbnails_url:'http://118.89.197.156:8000/thumbnails_'+file_name,
				position:ctx.request.body.fields.position,
				target:ctx.request.body.fields.target
			});
			fs.rename(files.file.path, config.upDir + file_name, (err) => {
				console.log(err);
			});
			let adLabels = [];
			let elements = '';
			for(let i of ctx.request.body.fields.type){
				if(i===','){
					adLabels.push(elements);
					elements = '';
				}
				else{
					elements += i;
				}
			}
			adLabels.push(elements);
			for(let j of adLabels){
				let adType = await ad_label.findOne({where:{name:j}});
				await ad_now.addAd_label(adType);
			}
			gm(config.upDir + file_name).resize(960,null).write(config.upDir+'thumbnails_'+file_name,()=>{});
			let buf = await fs.readFileSync(config.upDir+file_name);
			await ad_now.update({md5:md5(buf)});
		}
		lib.msgTranslate(ctx,200, {}, {code: 1, msg: '上传成功'});
		await next();
	});

	router.post('/action=get_picture', async (ctx, next) => {
		let user_person = await user.findOne({where: {email: ctx.session.custom_email}});
		let user_person_ad = await user_person.getAds();
		let data = {};
		data.ads = [];
		for (let i = 0; i < user_person_ad.length; ++i) {
			data.ads[i] = {};
			data.ads[i].id = user_person_ad[i].ad_id;
			data.ads[i].src = user_person_ad[i].thumbnails_url;
		}
		lib.msgTranslate(ctx,200, data, {code: 1, msg: '获取图片成功！'});
		await next()
	});
};