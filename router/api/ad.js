/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:54
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const koaBody = require('koa-body');
const md5 = require('md5');
const images = require("image-size");
const gm = require('gm');
let user = db.models.user;
let ad_label = db.models.ad_label;
let ad = db.models.ad;
module.exports = (router)=>{
	let prefix = function (url){
		return `/ad${url}`;
	};

	Array.prototype.removeByValue = function(val) {
		for(let i=0; i<this.length; i++) {
			if(this[i] === val) {
				this.splice(i, 1);
				break;
			}
		}
	};

	router.post(prefix('/upload'), koaBody({
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
				let user_person = await user.find({where: {email: ctx.session.custom_email}});
				let image = images(files.file[i].path);
				let ad_now = await user_person.createAd({
					name:ctx.request.body.fields.name + i.toString(),
					file_name:file_name,
					size: files.file[i].size,
					ad_size: image.width.toString() + '×' + image.height.toString(),
					ad_type:ctx.request.body.fields.ad_type,//目前仅支持图片
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
					let adType = await ad_label.find({where:{name:j}});
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
				ad_type:ctx.request.body.fields.ad_type,
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

    router.post(prefix('/get'), async(ctx, next)=>{
        let data = {};
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        let all_ad = await user_person.getAds();
        for(let i of all_ad){
            let temp = {};
            temp = {
                adId:i.ad_id,
                name:i.name,
                src:i.thumbnails_url,
                target:i.target,
                position:i.position
            };
            let all_pack = await i.getResources();
            temp.pack = [];
            for(let j = 0;j<all_pack.length;++j){
                temp.pack[j] = all_pack[j].name;
            }
            let types = await i.getAd_types();
            temp.adLabel = [];
            if(types.length>0){
                for(let j of types){
                    temp.adLabel.push(j.name);
                }
            }
            data[i.picture_id] = temp;
        }
        lib.msgTranslate(ctx, 200,data,{code:1,msg:'获取图片列表成功！'});
        await next();
    });

    router.post(prefix('/modify'), async(ctx,next)=>{
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        let ad_one = await user_person.getAds({where:{picture_id:ctx.request.body.id}});
        let resource_now = await ad_one.getResources();
        if(ad_one[0].target !== ctx.request.body.newTarget){
            for(let r of resource_now){
                let buf = await fs.readFileSync(config.upDir+r.resource_id+'.json');
                let main = JSON.parse(buf);
                for(let i of main){
                    if(i.picture_id === ad_one.picture_id){
                        i.ad_name=ctx.request.body.newName;
                        i.ad_target=ctx.request.body.newTarget;
                        i.ad_qrcode_position=ctx.request.body.newPosition;
                    }
                }
            }
        }
        await ad_one[0].update({
            name:ctx.request.body.newName,
            target:ctx.request.body.newTarget,
            position:ctx.request.body.newPosition
        });
        let new_adType = ctx.request.body.new_adType;
        let old_adType = await ad_one[0].getAd_types();
        for(let i of old_adType){
            let flag = 0;
            for(let j of new_adType){
                if(i.name === j){
                    flag = 1;
                    break;
                }
            }
            if(flag === 0){
                ad_one[0].removeAd_type(i);
            }
            else{
                new_adType.removeByValue(i.name);
            }
        }
        if(new_adType.length>0){
            for(let i of new_adType){
                let t = await ad_label.findOne({where:{name:i}});
                await ad_one[0].addAd_type(t);
            }
        }
        lib.msgTranslate(ctx,200,{},{code:1,msg:'修改成功！'});
        await next();
    });

    router.post(prefix('/del'), async(ctx,next)=>{
        let del_ads = ctx.request.body.adId;
        let user_person = await user.find({where:{email:ctx.session.custom_email}});
        let err = '';
        let flag = 0;
        for(let i of del_ads){
            let ad_one = await ad.find({where:{picture_id:i}});
            let resource_all = await ad_one.getResources();
            if(resource_all.length>0){
                err = err + ad_one.name + ' ';
                flag = 1;
            }
            else{
                let types = await ad_one.getAd_types();
                await ad_one.removeAd_types(types);
                await fs.unlinkSync(config.upDir + ad_one.file_name);
                await fs.unlinkSync(config.upDir + 'thumbnails_'+ad_one.file_name);
                await ad_one.destroy();
            }
        }
        if(flag === 0){
            lib.msgTranslate(ctx,200,{},{code:1,msg:'删除成功！'});
        }
        else{
            lib.msgTranslate(ctx,200,{},{code:7,msg:err+'删除失败！'});
        }
        await next();
    });
};