const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const nodemailer = require('nodemailer');

let lib = (function () {
    let autoImport = (nextPath,callback) => {
        let isDir = fs.statSync(nextPath).isDirectory();
        if(isDir){
            fs
                .readdirSync(nextPath)
                .filter((file) => {
                    return file !== "index.js" && file !== "migrate.js" && file.indexOf(".") !== 0;
                }).forEach((fileName) => {
                let tmpPath = path.join(nextPath,fileName);
                if(fs.statSync(tmpPath).isDirectory()){
                    autoImport(tmpPath,callback);
                }else{
                    callback(tmpPath);
                }
            });
        }
    };
    let msgTranslate = (ctx,code,data,msg)=>{
        ctx.response.status = code;
        ctx.body = {
	        data:data,
            status:msg
        }
    };
	let create_qrcode = function (url, file_name, file_path) {
		return new Promise(function (resolve, reject) {
			let sh = `myqr '${url}' -n '${file_name}' -d '${file_path}'`;
			console.log(sh);
			shell.exec(sh,function (code, stdout, stderr) {
				if (code === 0){
					resolve('Success!');
				}
				else {
					reject(stderr);
				}
			})
		});
	};
	let transporter = nodemailer.createTransport({
		service: '126',
		auth: {
			user: 'pobooks@126.com',
			pass: 'messenger126'
		}
	});
	let isOnline = (time,freq)=>{
		let now = new Date;
		return now - time <= freq * 60000;
	};
    return{
        autoImport,
        msgTranslate,
	    create_qrcode,
	    transporter,
	    isOnline
    }
}());

module.exports = lib;