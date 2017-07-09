/**
 * Created by lcr on 17-6-29.
 */
const md5 = require('md5');
const js_zip = require('jszip');
const fs =require('fs');
const crypto = require('crypto');
const picture_dir = '/home/ubuntu/file/';
const zip_dir = '/home/ubuntu/file/resource/';
let md5sum = crypto.createHash('md5');
let str;
module.exports=(name,zip_name)=>{
    let zip = new js_zip();
    let img = zip.folder("/images/");
    for(let i of name) {
        let data = fs.readFileSync(picture_dir+i);
        img.file(i,data, {base64: true});
    }
    zip.generateAsync({type:"nodebuffer"})
        .then(function(content) {
            fs.writeFile(zip_dir+zip_name+".zip", content, function(err){
                let stream = fs.createReadStream(zip_dir+zip_name+".zip");
                stream.on('data', function(chunk) {
                    md5sum.update(chunk);
                });
                stream.on('end', function() {
                    str = md5sum.digest('hex').toUpperCase();
                    console.log('文件:'+path+',MD5签名为:'+str);
                });
            });
        });
    return str;
};