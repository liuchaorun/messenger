// let path = require('path'),
//     child_process = require('child_process');
//
// module.exports = function(originalFile, targetFile, patchFile, cb) {
//
//     let bsdiffPath = path.join(__dirname, 'bin', process.platform, 'bsdiff');
//
//     if (process.platform === 'win32') {
//         bsdiffPath += '.exe';
//     }
//
//     let options = {
//         timeout: 60 * 1000
//     };
//
//     let args = [originalFile, targetFile, patchFile];
//
//     return child_process.execFile(bsdiffPath, args, options, cb);
// };
let shell = require('shelljs');
module.exports = async function a(url,file_name,file_path) {
    let myqr = await shell.exec('myqr '+url+' -n'+file_name+' -d'+file_path,{async:true});
    if(myqr.code===0){
        return myqr.stdout;
    }
    else{
        return myqr.stderr;
    }
};