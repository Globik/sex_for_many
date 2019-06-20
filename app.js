// which psql heroku pg:psql --app frozen-atoll-47887
const nano_adr='ipc:///tmp/janus.ipc';// to janus webrtc gateway nano transport
const HPORT = 3000;
const DB_URL='postgress://globik:null@localhost:5432/test';
//const DB_URL=process.env.DATABASE_URL;
const koaBody=require('koa-body');


const Koa=require('koa');
//const koaBody=require('koa-body');
const passport=require('koa-passport');
const WebSocket=require('ws');
const {websock}=require('./libs/websock.js');
const shortid=require('shortid');

const nano=require('nanomsg');
const subnano=nano.socket('pair');


const url=require('url');
const Pool=require('pg-pool');
const PgStore=require('./libs/pg-sess.js');
const PS=require('pg-pubsub');
const pgtypes=require('pg').types;
const render=require('koa-rend');
const serve=require('koa-static');
const session=require('koa-generic-session');
const pubrouter=require('./routes/pubrouter.js');
const adminrouter=require('./routes/adminrouter.js');
const mainmenu=require('./config/app.json');
//const adminrouter=require('./routes/adminrouter.js');

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str=>str);
const pars=url.parse(DB_URL);
const cauth=pars.auth.split(':');
const pg_opts = { user:cauth[0],password:cauth[1],host:pars.hostname,port:pars.port,database:pars.pathname.split('/')[1],
	ssl:false
	//Client:pgn
	};
const pool = new Pool(pg_opts);
const pg_store=new PgStore(pool);
var dop_ssl="";
if(process.env.DEVELOPMENT==="yes"){
	
}else{dop_ssl="?ssl=true";}
var ps=new PS(DB_URL+dop_ssl);

pool.on('connect', function(client){console.log('db connected!')})
pool.on('error', function(err, client){console.log('db err: ', err.name)})
pool.on('acquire', function(client){console.log('db acquired!')})

subnano.connect(nano_adr);
const droom=new Map();

const app=new Koa();
app.keys=['your-secret']
app.use(serve(__dirname+'/public'));
app.use(session({store: pg_store}, app))

render(app,{root:'views', development: true})
app.use(koaBody());
//app.use(koaBody({multipart:true,formidable:{}}))
require('./config/auth.js')(pool,passport)

app.use(passport.initialize())
app.use(passport.session())

function xhr(){
return async function xhr(ctx,next){
ctx.state.xhr=(ctx.request.get('X-Requested-With')==='XMLHttpRequest')
await next()
}
}
app.use(xhr());
app.use(async (ctx, next)=>{
ctx.state.showmodule = mainmenu;//see config/app.json
ctx.db=pool;
await next();	
})
app.use(pubrouter.routes()).use(pubrouter.allowedMethods());
//app.use(adminrouter.routes()).use(adminrouter.allowedMethods());

app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);
//await next();
/*
try{
await next();

if(ctx.status === 404) ctx.throw(404, "fuck not found",{user:"fuck userss"});
}catch(err){
//ctx.status=err.status || 500;
//console.log('THIS>STATUS: ', ctx.status);
console.log("error");
if(ctx.status=== 404){
ctx.session.error='not found';
console.log('method: ', ctx.method, 'ctx.url: ', ctx.url);
if(!ctx.state.xhr)ctx.body=await ctx.render("error",{});
return;

}


}
*/
});

app.on('error', function(err, ctx){
console.log('app.on.error: ', err.message, 'ctx.url : ', ctx.url);
});

pg_store.setup().then(function(){
const servak=app.listen(process.env.PORT || HPORT);
const wss=new WebSocket.Server({server:servak});

/* HELPERS FOR WS */

function broadcast_room_no_me(ws, obj){
wss.clients.forEach(function(el){
if(el !==ws && el.readyState===WebSocket.OPEN){
if(el.url !=="/gesamt")el.send(JSON.stringify(obj));	
}
})	
}


function send_target_trans(trans, obj, sid){
console.log("send_target_trans(): ", trans);
for(var el of wss.clients){
console.log("OF el.trans: ",el.trans);
if(el.trans==trans){
console.log("Yes. It's target trans! ",el.trans, trans,'el.sid ', el.sid,' sid ', sid);

if(sid==1){
if(el.sid==0){
el.sid=obj.data.id;
console.log("Attaching a session_id");
}
	
}else if(sid==2){console.log('Detaching a session id');el.sid=0}
console.log("NOW SENDING ",obj);

if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
break;	
}
}
}

function send_target_sess(session_id, obj){
console.log("send_target_sess(): ", session_id);
for(var el of wss.clients){
if(el.sid == session_id){
console.log("Yes, session matches. ",el.sid, session_id);
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
break;	
}	
}
}

function broadcast_room_event(obj){
console.log("broadcast_new_room(): ");
for(var el of wss.clients){
if(el.url == "/gesamt"){
console.log("Yes, its matches. ",el.url);
try{
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
}catch(e){console.log('err in broadcast room event: ', e)}
}	
}
}
function subsend(ob){
let a;
try{a=JSON.stringify(ob);subnano.send(a);}catch(e){retrun;}	
}
/* END OF HELPERS */

subnano.on('data',function(msg){
//console.log('data: ',msg.toString())
let abbi=msg.toString();

let l;
//let owner=false;
try{l=JSON.parse(abbi);}catch(e){console.log(e);return;}	
l.typ="janus";
let sess=0;var feed=0;
if(l.transaction){
let a=l.transaction.split("_");
let len=a.length;
l.transi=a[len-1];
let c=Number(a[len-1]);
if(c==10){
console.log("'create' session");
sess=1;//ws.sid=l.data.id => new session
}else if(c==11){
console.log("'destroy' session_id");
sess=2;
}else if(c==40){
//create room
if(l.plugindata.data.videoroom=="created"){
droom.set(l.plugindata.data.room,{session_id:l.session_id,handle_id:l.sender});
}
}else if(c==41){
//destroy room
if(l.plugindata && l.plugindata.data.videoroom=="destroyed"){
droom.delete(l.plugindata.data.room);	
}
}else if(c==20){
//room exists
if(l.plugindata && l.plugindata.data.room)
droom.set(l.plugindata.data.room,{session_id:l.session_id,handle_id:l.sender});
}else if(c==25){
//ping pong
return;	
}
console.log("before send target trans",a);
send_target_trans(a[len-2], l, sess);
}
if(l.janus=="media"){
console.log("media is here",l);	 
send_target_sess(l.session_id, l);
}
})

ps.addChannel('events', function (msg){
console.log('msg: ', msg);
console.log('table: ', msg.table);
send_to_all(wss, msg.data);
});
ps.addChannel('on_smart_cb', function(msg){
console.log('msg notify: ',msg);
send_to_all(wss, msg.data);	
});

//websock(wss,pool,sse,shortid,server,RTCPeerConnection,RTCSessionDescription,peerCapabilities,roomOptions);
//websock(wss,pool, 'sse', shortid,' server', 'RTCPeerConnection ', 'RTCSessionDescription' , 'peerCapabilities,roomOptions');
function noop(){}
const interval=setInterval(function ping(){
wss.clients.forEach(function each(ws){
if(ws.isAlive===false)return ws.terminate();
ws.isAlive=false;
ws.ping(noop);	
})	
},50000)
function heartbeat(){this.isAlive=true;}
wss.on('connection', function(ws, req){
console.log("websock client opened!", req.url);
ws.trans=null;
ws.sid=0;
ws.hid=0;
ws.owner=false;
ws.roomid=0;
ws.feed=0;
ws.url=req.url;
if(req.url !== "/gesamt")wsend({typ:"usid", msg: "Hi from server!"});

ws.isAlive=true;
ws.on('pong',heartbeat);
ws.on('message',function(msg){
console.log("websocke message: ",msg);
var send_to_client=0;
let l;
try{
l=JSON.parse(msg);	
}catch(e){return;}
if(l.janus){
subnano.send(msg);
send_to_client=1;
}

if(l.typ=="onuser"){
console.log("Typ: ", l.typ);
console.log('l: ',l);
ws.trans=l.username;
ws.owner=l.owner;

ws.roomid=l.roomid;
send_to_client=1;	
}else if(l.typ=="onair"){
console.log("ON AIR!");
l.typ="atair";//for subscribers signal
broadcast_room_no_me(ws, l);
broadcast_room_event(l);
send_to_client=1;	
}else if(l.typ=="outair"){
//publisher unpublished the stream. Notify all about it
l.typ="outair";
broadcast_room_no_me(ws,l);
broadcast_room_event(l);
send_to_client = 1;	
}else{}


if(send_to_client==0)ws.send(msg);
});
ws.on('error', function(er){console.log("websock err: ", err);})
ws.on('close', function(){
console.log("websocket closed");
if(droom.has(ws.roomid)){
let b=droom.get(ws.roomid);

if(!b){console.log("No room id?");return;}
let d={};
d.session_id=b.session_id;
d.handle_id=b.handle_id;
d.transaction=ws.trans+"_41";
d.janus="message";
d.body={};
d.body.request="destroy";
d.body.room=ws.roomid;
//janus:"message",body:{request:"destroy",room:6666}
subsend(d);
console.log("DELETING ROOM=> ",ws.roomid, ' ',b.session_id,' ',b.handle_id);
droom.delete(ws.roomid);
}
});
})

console.log('soll on port: ', HPORT, 'started.');
}).catch(function(err){
console.log("err setup pg_store", err.name,'\n',err);
});
function send_to_all(wss, obj){
wss.clients.forEach(function each(client){
wsend(client,obj);
})
}
function wsend(ws, obj){
let a;
try{
a=JSON.stringify(obj);
if(ws.readyState===WebSocket.OPEN)ws.send(a);	
}catch(e){console.log('err in stringify: ',e);}	
}
process.on('unhundledRejection',function(reason, p){
console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});	
