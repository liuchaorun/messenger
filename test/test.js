/**
 * Created by lcr on 17-5-16.
 */
// const db = require('../db/index');
// const Sequelize = require('sequelize');
// let resource = db.models.resource;
// let ad = db.models.ad;
// let user = db.models.user;
// let ad_label = db.models.ad_label;
// const Op = Sequelize.Op;
// async function a() {
//     // await user.create({
// 	 //    username:'lcr',
// 	 //    email:'1558531230@qq.com',
// 	 //    password:'123456',
// 	 //    last_login_time:new Date(),
// 	 //    work_place:'ssdut'
//     // })
// 	let usr = await user.find({where:{email:{[Op.eq]:'1558531230@qq.com'}}});
// 	await usr.createAd_label({name:'asd'});
// 	let adLabel = await ad_label.find({where:{name:{[Op.eq]:'asd'}}});
// 	console.log(adLabel.name);
// }
// a();
//const fs = require('fs');
// let data = {};
// data.i = "qwe";
// data = JSON.stringify(data);
// fs.writeFileSync('/home/lcr/1.json',data);
// let d = fs.readFileSync('/home/lcr/1.json');
// d = JSON.parse(d);
// console.log(d.i);
//fs.unlinkSync('/home/lcr/1.json');
// Array.prototype.minus = function (arr) {
//     let result = new Array();
//     let obj = {};
//     for (let i = 0; i < arr.length; i++) {
//         obj[arr[i]] = 1;
//     }
//     for (let j = 0; j < this.length; j++) {
//         if (!obj[this[j]]) {
//             obj[this[j]] = 1;
//             result.push(this[j]);
//         }
//     }
//     return result;
// };
// let a = new Array(1,2),b =new Array();
// b[0]=1;
// console.log(a.minus(b)[0]);
// const gm = require('gm');
// gm('/home/lcr/1.jpg').resize(960,null).write('/home/lcr/2.jpg',()=>{});
// let fs = require('fs');
// let crypto = require('crypto');
//
// let path = '/target/file.data';
// let start = new Date().getTime();
// let md5sum = crypto.createHash('md5');
// let stream = fs.createReadStream(path);
// stream.on('data', function(chunk) {
//     md5sum.update(chunk);
// });
// stream.on('end', function() {
//     str = md5sum.digest('hex').toUpperCase();
//     console.log('文件:'+path+',MD5签名为:'+str+'.耗时:'+(new Date().getTime()-start)/1000.00+"秒");
// });
// let a = "ab.c";
// let q = a.split('.');
// console.log(q);
// const md5 = require('md5');
// const js_zip = require('jszip');
// const fs =require('fs');
// const crypto = require('crypto');
// const picture_dir = '/home/lcr/';
// const zip_dir = '/home/lcr/';
// let md5sum = crypto.createHash('md5');
// function a(name,zip_name){
//     let zip = new js_zip();
//     let img = zip.folder("/images/");
//     for(let i of name) {
//         let data = fs.readFileSync(picture_dir+i);
//         img.file(i,data, {base64: true});
//     }
//     zip.generateAsync({type:"nodebuffer"})
//         .then(function(content) {
//             fs.writeFileSync(zip_dir+zip_name+".zip", content);
//         });
// }
// let name = new Array();
// let str;
// name[0]='1.jpg';
// a(name,'test');
// let stream = fs.createReadStream(zip_dir+"test.zip");
// stream.on('data', function(chunk) {
//     md5sum.update(chunk);
// });
// stream.on('end', function() {
//     str = md5sum.digest('hex').toUpperCase();
//     console.log('文件:.zip'+',MD5签名为:'+str);
// });
const db = require('../db/index');
let user = db.models.user;
let ad = db.models.ad;
async function testdb() {
	try{
		let data ={};
		let user_person = await user.find({where:{email:'1558531230@qq.com'}});
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
			let types = await i.getAd_labels();
			temp.adLabel = [];
			if(types.length>0){
				for(let j of types){
					temp.adLabel.push(j.name);
				}
			}
			data[i.ad_id] = temp;
		}
		console.log(data);
	}
	catch (e) {
		console.log(e);
	}
}
testdb();