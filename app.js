// which psql heroku pg:psql --app frozen-atoll-47887
const plugin_name="janus.plugin.videoroom";
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
const Router=require('koa-router');
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
const feeds=new Map();
const gr="\x1b[32m";
const rs="\x1b[0m";

const app=new Koa();
const puber=new Router();
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

var test_btc_address;
var btc_address;
var btc_percent;
var btc_pay=false;
var is_test_btc=true;

app.use(async (ctx, next)=>{
ctx.state.showmodule = mainmenu;//see config/app.json
console.log("FROM HAUPT MIDDLEWARE =>",ctx.path);
ctx.db=pool;
ctx.state.btc_pay= btc_pay;
ctx.state.is_test_btc = is_test_btc;

ctx.state.test_btc_address = test_btc_address;
ctx.state.btc_address = btc_address;
ctx.state.btc_percent = btc_percent;

if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){
if(ctx.path=="/home/profile/enable_btc"){
console.log("occured /home/profile/enable_btc");
if(!btc_pay){
btc_pay=true;
ctx.state.btc_pay=btc_pay;
}else{btc_pay=false;ctx.state.btc_pay=btc_pay;}

}else if(ctx.path=="/home/profile/btc_test"){
if(is_test_btc){
is_test_btc=false;	
ctx.state.is_test_btc=is_test_btc;
}else{
is_test_btc=true;
ctx.state.is_test_btc=is_test_btc;	
}
}else if(ctx.path=="/home/profile/set_btc_adr"){
console.log("body: ",ctx.request.body);
let {test}=ctx.request.body;
if(test){
test_btc_address=ctx.request.body.test_btc_adr;
ctx.state.test_btc_address=test_btc_address;
}else{
btc_address = ctx.request.body.test_btc_adr;
ctx.state.btc_address=btc_address;	
}
btc_percent=ctx.request.body.percent;
ctx.state.btc_percent=btc_percent;


}else{}

}

await next();	
})

puber.post('/testEvent', async function food(ctx){
console.log("event_body ", gr, JSON.stringify(ctx.request.body) ,rs);
let d=ctx.request.body;
d.forEach(function(el){
if(el.type==64){
//room created or destroyed or published events
let a=el.event.data.event;
if(!a){console.log("no data event");return;}
let rid = el.event.data.room;

if(a=="created"){
}else if(a=="destroyed"){
//if(vroom.has(rid)){
}else if(a=="published"){
	console.log(gr ,"published", rs);
	if(!feeds.has(rid)){
let feed_id=el.event.data.id;
feeds.set(rid,{feed:feed_id})
}
}	
}	

})
ctx.body={info:"ok"}
})
app.use(pubrouter.routes()).use(pubrouter.allowedMethods());
app.use(puber.routes()).use(puber.allowedMethods());
app.use(adminrouter.routes()).use(adminrouter.allowedMethods());

app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);
//await next();

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

});

app.on('error', function(err, ctx){
console.log('app.on.error: ', err.message, 'ctx.url : ', ctx.url);
});

pg_store.setup().then(on_run).catch(function(err){console.log("err setup pg_store", err.name,'\n',err);});

function on_run(){
console.log('soll on port: ', HPORT, 'started.');
pool.query("delete from room",[], function(err,res){
if(err)console.log(err);	
});
pool.query("select*from prim_adr where type=true",[], 
function(err,res){if(err)console.log(err);
console.log("RESPONES ", res.rows);
if(res.rows.length)test_btc_address=res.rows[0].adr;
});
pool.query("select*from prim_adr where type=false",[], 
function(err,res){if(err)console.log(err);
//console.log("RESPONES ", res.rows[0].adr);
if(res.rows.length)btc_address=res.rows[0].adr;
});
const servak=app.listen(process.env.PORT || HPORT);
const wss=new WebSocket.Server({server:servak});

/* HELPERS FOR WS */

function broadcast_to_all_no_me(ws, obj){
wss.clients.forEach(function(el){
if(el !==ws && el.readyState===WebSocket.OPEN){
if(el.url == ws.url)el.send(JSON.stringify(obj));	
}
})	
}


function send_target_trans(trans, obj, sid){
for(var el of wss.clients){
if(el.trans==trans){
if(sid==1){
//if(el.sid==0){
el.sid=obj.data.id;
console.log("Attaching a session_id");
//}
}else if(sid==2){
console.log('Detaching a session id');
el.sid=0
}
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
break;	
}
}
}

function send_target_sess(session_id, obj){
for(var el of wss.clients){
if(el.sid == session_id){
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
break;	
}	
}
}

function broadcast_room(obj){
for(var el of wss.clients){
if(el.url == "/gesamt"){
try{
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
}catch(e){console.log('err in broadcast room event: ', e)}
}	
}
}

function send_target(msg, url){
for(var el of wss.clients){
if(el.url == url){
if(el.readyState===WebSocket.OPEN)el.send(msg);
}
}
}

function get_user_count(url){
let user_count=0;
let viewers=0;
for(var el of wss.clients){
if(el.url==url){
	console.log(el.url,url);
user_count++;
if(el.roomok){viewers++}
}
}
return {user_count, viewers};	
}
function send_to_url(msg, url){
console.log('send to url():',url)
var cnt = get_user_count(url);// how much users and viewers in a chat room
for(var el of wss.clients){
if(el.url == url){
if(el.readyState===WebSocket.OPEN){
try{
msg.user_count=cnt.user_count;
msg.viewers=cnt.viewers;
let a=JSON.stringify(msg);
el.send(a);
}catch(e){console.log(e);}
}
}
}
}

function subsend(ob){
let a;
try{a=JSON.stringify(ob);subnano.send(a);}catch(e){retrun;}	
}
/* END OF HELPERS */

subnano.on('data',function(msg){
let abbi=msg.toString();

let l;
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
send_to_all(wss, msg.data);// may be to defined room?
});
ps.addChannel('on_smart_cb', function(msg){
console.log('msg notify: ',msg);
send_to_all(wss, msg.data);	//todo reinvestigate behavor
});


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
ws.trans=null;//unique name
ws.sid=0;//janus session
ws.owner=false;//is a publisher 

ws.url=req.url;// url == room id == user id
ws.roomok=false;// is currently started subscriber//feed
let feedi;
var roomi=Number(ws.url.substring(1));//publisher's feed id from janus
if(feeds.has(roomi)){
let feedy=feeds.get(roomi);
console.log("feedy")
feedi=feedy.feed;
}else{
console.log("no feedy");
feedi=0;
}
if(req.url !== "/gesamt"){
console.log("hi from server")
let siska=get_user_count(ws.url)
wsend(ws, {typ:"usid", msg: "Hi from server!", pubid:feedi,user_count:siska.user_count,viewers:siska.viewers});//for a subscriber
//send_to_url({typ: "joinchat"}, req.url);
}else{console.log("no hi from server")}

ws.isAlive=true;
ws.on('pong',heartbeat);

ws.on('message',function sock_msg(msg){
//console.log("websocke message: ",msg);
var send_to_client=0;
let l;
try{
l=JSON.parse(msg);	
}catch(e){return;}
if(l.janus){
subnano.send(msg);
send_to_client=1;
}
if(l.typ=="msg"){
if(l.to){
send_target(msg, req.url);
send_to_client=1;
}
}else if(l.typ=="onuser"){
console.log("Typ: ", l.typ);
console.log('l: ',l);
ws.trans=l.username;
ws.owner=l.owner;
send_to_url({typ: "joinchat"}, req.url);

send_to_client=1;	
}else if(l.typ=="onair"){
console.log("ON AIR!");

l.typ="atair";//for subscribers signal
l.v=get_user_count(ws.url).viewers
broadcast_to_all_no_me(ws, l);
//broadcast_room(l);

let sis=`insert into room(room_id,descr,src,nick) values($1,$2,$3,$4)`;
pool.query(sis,[l.roomid,l.roomdesc,l.src,l.nick], function(err,res){if(err)console.log('inserting a room: ',err);
broadcast_room(l);
});

send_to_client=1;	
}else if(l.typ=="outair"){
//publisher unpublished the stream. Notify all about it
l.typ="outair";
broadcast_to_all_no_me(ws,l);
broadcast_room(l);
feeds.delete(roomi);
pool.query("delete from room where  room_id=$1", [l.roomid] ,function(err,res){
if(err){console.log(err);}	
});
send_to_client = 1;	
}else if(l.typ=="roomok"){

ws.roomok=true;	
send_to_url({typ: "joinchat"}, ws.url);
let ct=get_user_count(req.url);
l.typ="viewers";

l.viewers=ct.viewers;

broadcast_room(l);
console.log("MUST BE0 !",l.roomid);
pool.query("update room set v=v+1 where room_id=$1",[l.roomid],function(err,res){
if(err)console.log(err);
console.log("MUST BE1 !",l.roomid);
});
send_to_client=1;
}else if(l.typ == "roomnot"){
ws.roomok=false;	
//let ct=get_user_count(req.url);
send_to_url({typ: "joinchat"}, ws.url);
let ct=get_user_count(req.url);
l.typ="viewers";
l.viewers=ct.viewers;
broadcast_room(l);
//send_to_url(l,'/gesamt');
pool.query("update room set v=v-1 where room_id=$1",[l.roomid],function(err,res){
if(err)console.log(err);})	
send_to_client=1;
}else{}


if(send_to_client==0)ws.send(msg);
});
ws.on('error', function(er){console.log("websock err: ", err);})

ws.on('close', function(){
console.log("websocket closed");
var roomid=Number(ws.url.substring(1));
send_to_url({typ: "joinchat"}, ws.url)

if(ws.owner){
console.log("It's OWNER!");
console.log('room size: ',droom.size);

if(droom.has(roomid)){
let b=droom.get(roomid);
console.log("HAS ROOM ID!");
if(!b){console.log("No room id?");return;}
let d={};
d.session_id=b.session_id;
d.handle_id=b.handle_id;
d.transaction=ws.trans+"_41";
d.janus="message";
d.body={};
d.body.request="destroy";
d.body.room=roomid;
//janus:"message",body:{request:"destroy",room:6666}
subsend(d);

console.log("DELETING ROOM=> ", roomid, ' ',b.session_id,' ',b.handle_id);

d.session_id=b.session_id;
d.handle_id=b.handle_id;
d.transaction=ws.trans+"_13";
d.janus="detach";
d.plugin=plugin_name;
subsend(d);

d.transaction=ws.trans+"_11";
d.session_id=b.session_id;
d.janus="destroy";
subsend(d);

broadcast_to_all_no_me(ws, {typ:"outair"});
droom.delete(roomid);
broadcast_room({typ:"outair", roomid:roomid});
feeds.delete(roomid);
pool.query("delete from room where room_id=$1", [roomid] ,function(err,res){
if(err){console.log(err);}	
})	

}
};
//console.log('soll on port: ', HPORT, 'started.');
})
//console.log('soll on port: ', HPORT, 'started.');
})

}



function send_to_all(wss, obj){
wss.clients.forEach(function each(client){
wsend(client,obj);
})
}
function wsend(ws, obj){
console.log("hallo wsend()")
let a;
try{
a=JSON.stringify(obj);
if(ws.readyState===WebSocket.OPEN)ws.send(a);	
}catch(e){console.log('err in stringify: ',e);}	
}
process.on('unhundledRejection', function(reason, p){
console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});	
// sudo mkdir /var/run/pgsql
