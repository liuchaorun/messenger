/**
 * Created by lcr on 17-3-19.
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/index');
const routerAndroid = require('./routerAndroid/index');
const app = new koa();
const session = require("koa-session");
const Store = require("./lib/store");

const CONFIG = {
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
};
app.keys = ['cloudExhibition'];
app.use(bodyParser());
app.use(session(CONFIG, app));
app.use(require('koa-static')(__dirname + '/background'));
app.use(router());
app.use(routerAndroid());
app.listen(3000);