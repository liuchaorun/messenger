/**
 * Created by lcr on 17-3-19.
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/router');
const app = new koa();
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
app.on('error', (err, ctx) =>
    log.error('server error', err, ctx)
);
app.use(async(ctx,next)=>{
    await next();
    //if(/^\/pages(\/[^0-9]{0,99}){0,99}$/.test(ctx.url)===true)if(ctx.session.custom_email===undefined) ctx.redirect('http://118.89.197.156:3000/');
});
app.use(bodyParser());
app.use(res_api());
app.use(session({
    store: new Store()
}));
app.use(require('koa-static')(__dirname + '/background'));
app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(3000);