/**
 * Created by lcr on 17-3-19.
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/index');
const routerAndroid = require('./routerAndroid/index');
const app = new koa();
const session = require("koa-session");
const lib = require('./config/config');

app.keys = ['cloudExhibition'];
app.use(bodyParser());
app.use(session(config.session, app));
app.use(require('koa-static')(__dirname + '/background'));
app.use(router());
app.use(routerAndroid());
module.exports = app;