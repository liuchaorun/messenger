/*
 * Creat by liuchaorun
 * Date 18-5-15
 * Time 下午7:36
 **/
const Store = require('../lib/store');

let config = {
	db:{
		database: 'postgres',
		username: 'postgres',
		password: 'daydaypicturepostgres',
		host: '118.89.197.156',
		port: 5432
	},
	upDir:'/home/lcr/file/',
	session:{
        key: 'messenger', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        store:new Store(),
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    }
};

module.exports = config;