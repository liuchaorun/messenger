/*
 * Created by liuchaorun
 * Date 18-5-16
 * Time 下午12:24
 **/
const lib = require('../../lib/lib');
const db = require('../../db/index');
const config = require('../../config/config');
const fs = require('fs');
let screen = db.models.screen;
let resource = db.models.resource;
let ad = db.models.ad;
module.exports = (router) => {
	//请求二维码
	router.post('/get_qrcode', async (ctx, next) => {
		let uuid = ctx.request.body.uuid;
		let screen_now = await screen.find({where: {uuid: uuid}});
		let resource_now = await resource.find({where: {resource_id: screen_now.resource_id}});
		let ad_now = await ad.find(({where: {ad_id: ctx.request.body.ad_id}}));
		let qrcode_name = 'qrcode-' + Date.now() + '.png';
		let data = {};
		let ad_labels = await ad_now.getAd_labels();
		let adLabel = '';
		for (let i of ad_labels) {
			adLabel = adLabel + i.name + ' ';
		}
		await lib.create_qrcode('http://118.89.197.156:3000/qrCode.html?' + 'uuid=' + uuid + '&adType=' + encodeURI(adLabel) + '&adId=' + ad_now.ad_id + '&target=' + ad_now.target, qrcode_name, config.qrcode_dir);
		data.qr_url = 'http://118.89.197.156:8000/qrcode/' + qrcode_name;
		let buf = await fs.readFileSync(config.upDir + resource_now.resource_id + '.json');
		let main = JSON.parse(buf);
		for (let i of main.ad) {
			if (i.ad_id === ad_now.ad_id) {
				i.qr_url = 'http://118.89.197.156:8000/' + qrcode_name;
			}
		}
		lib.msgTranslate(ctx, 200, data, {code: 1, msg: '获取成功！'});
		await next();
	});
};