/*
 * created by liuchaorun
 * Date 2018/5/17
 * Time 16:07
 **/
const log4js = require('log4js');
const path = require('path');
log4js.configure({
    appenders : {
        console: {type: 'console'},
        cheeseLogs: {type: 'file', filename: path.join(__dirname, '../log/err.log')}
    },
    categories: {
        cheese: {appenders: ['cheeseLogs'], level: 'error'},
        another: {appenders: ['console'], level: 'trace'},
        default: {appenders: ['console', 'cheeseLogs'], level: 'trace'}
    }
});
let logger = log4js.getLogger('messenger');
logger.level = 'ERROR';
module.exports = logger;