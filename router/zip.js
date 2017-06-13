/**
 * Created by lcr on 17-6-12.
 */
const JSZip = require('jszip');
const fs = require('fs');
const zip = new JSZip();
module.exports=async function zipDir(dir,name) {
    let files = fs.readdirSync(dir);
    for(let i =0;i<files.length;++i){
        zip.folder("image").file(files[i],fs.readFileSync(dir+files[i]));
    }
    zip.generateAsync({type:"nodebuffer"}).then(function(content) {
        fs.writeFile(dir+name, content, function(err){
            if(err) console.log(err);
        });
    });
};
