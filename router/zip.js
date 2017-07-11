/**
 * Created by lcr on 17-6-29.
 */
const md5 = require('md5');
const js_zip = require('jszip');
const fs =require('fs');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const picture_dir = '/home/ubuntu/file/';
const model = require('../db/model');
const zip_dir = '/home/ubuntu/file/resource/';
let resource = model.resource;
let md5sum = crypto.createHash('md5');
let str;
module.exports= (name,main,zip_name,resource_new)=>{
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
                    console.log('文件:'+zip_name+".zip"+',MD5签名为:'+str);
                    main.md5 = str;
                    resource_new.update({md5:str});
                    main = JSON.stringify(main);
                    fs.writeFileSync('/home/ubuntu/file/' + resource_new.resource_id + '.json', main);
                });
            });
        });
    return str;
};