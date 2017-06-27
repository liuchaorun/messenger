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
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
app.on('error', (err, ctx) =>
    log.error('server error', err, ctx)
);
app.use(async(ctx,next)=>{
    await next();
    if(/^\/pages(\/[^0-9]{0,99}){0,99}$/.test(ctx.url)===true)if(ctx.session.custom_email===undefined) ctx.redirect('http://118.89.197.156:3000/');
});
app.use(bodyParser());
app.use(res_api());
app.use(session({
    store: new Store()
}));
app.use(require('koa-static')(__dirname + '/admin'));
app
    .use(router.routes())
    .use(router.allowedMethods());
let onlineUser = {},uSocket={};
io.on('connect', (socket)=>{
    socket.on('join',(data)=> {
        if(data.id===0){
            onlineUser[data.email]=data.email;
            uSocket[onlineUser[data.email]]=socket;
            console.log(data.email + ' join');
        }
        else {
            onlineUser[data.screen_id]=data.screen_id;
            uSocket[onlineUser[data.screen_id]]=socket;
            data.isOnline=true;
            uSocket[data.email].emit('isOnline',data);
            console.log(data.screen_id.toString() + ' join '+data.email);
        }
    });
    socket.on('online',(data)=>{
        if(onlineUser[data.screen_id]===undefined){
            data.isOnline=false;
        }
        else{
            data.isOnline=true;
        }
        uSocket[data.email].emit('isOnline',data);
        console.log(data.email + 'online');
    });
    socket.on('setTime',(data)=>{
        if(data.screen_id in uSocket){
            uSocket[data.screen_id].emit('setTime',data);
            console.log(data.email+' sendTime ' + data.screen_id.toString());
        }
    });
    socket.on('getPictureNow',(data)=>{
        if(data.email in uSocket){
            uSocket[data.email].emit('getPictureNow',data);
            console.log(' getPictureNow ' + data.screen_id);
        }
    });
    socket.on('sendPictureNow',(data)=>{
        if(data.email in uSocket){
            uSocket[data.email].emit('sendPictureNow',data);
            console.log(data.email + ' sendpictureNow ' + data.screen_id.toString());
        }
    });
    socket.on('nextPicture',(data)=>{
        if(data.screen_id in uSocket){
            uSocket[data.screen_id].emit('nextPicture',data);
            console.log(data.screen_id.toString() + ' nextPicture');
        }
    });
    socket.on('previousPicture',(data)=>{
        if(data.screen_id in uSocket){
            uSocket[data.screen_id].emit('previousPicture',data);
            console.log(data.screen_id.toString() + ' previousPicture');
        }
    });
    socket.on('changePicture',(data)=>{
        if(data.email in uSocket){
            uSocket[data.email].emit('changePicture',data);
            console.log(data.email + ' changePicture');
        }
    });
    socket.on('leave',(data)=>{
        if(data.id===1){
            if(onlineUser[data.email]!==undefined) uSocket[data.email].emit('leave',data);
            console.log(data.screen_id.toString() + ' leave ' + data.email);
        }
    });
    socket.on('pictureOrder', (data)=>{
        if(onlineUser[data.screen_id]!==undefined) uSocket[data.screen_id].emit('pictureOrder',data);
        console.log(data.screen_id.toString() + ' pictureOrder');
    });
    socket.on('disconnect',()=>{
        console.log('someone disconnect');
    });
});
server.listen(3000);