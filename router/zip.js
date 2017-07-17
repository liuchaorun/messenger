/**
 * Created by lcr on 17-6-29.
 */
const js_zip = require('jszip');
const fs =require('fs');
const picture_dir = '/home/ubuntu/file/';
const zip_dir = '/home/ubuntu/file/resource/';
module.exports= (name,zip_name)=>{
    let zip = new js_zip();
    let img = zip.folder("/images/");
    for(let i of name) {
        let data = fs.readFileSync(picture_dir+i);
        img.file(i,data, {base64: true});
    }
    zip.generateAsync({type:"nodebuffer"})
        .then(function(content) {
            fs.writeFile(zip_dir+zip_name+".zip", content, function(err){
                console.log(err);
            });
        });
    return str;
};