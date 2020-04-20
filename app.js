// which psql 
// heroku pg:psql --app frozen-atoll-47887
// sudo mkdir /var/run/pgsql
//ctrl+alt+T
//const HPORT = 80;
//const HPORT  = 3000;
const SPORT = 443;//8000;
const https = require('https');
const fs = require('fs');
const is_ssl_http = true;
//const DB_URL = 'postgress://globik:null@localhost:5432/test';
//const DB_URL=process.env.DATABASE_URL;//for heroku

const DB_URL = 'postgress://suka:suka@127.0.0.1:5432/globi';// for gayroom.ru



const koaBody=require('koa-body');
const Koa=require('koa');

const passport=require('koa-passport');
const WebSocket=require('ws');
const {websock}=require('./libs/websock.js');
const shortid=require('shortid');
const Router=require('koa-router');



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

const dkey='./data/groom_priv.pem';
const dcert='./data/mycert.pem';
const ca='./data/groom_ca.cert';
/*
const ssl_options={
	key: fs.readFileSync(dkey),
	cert: fs.readFileSync(dcert),
	ca: fs.readFileSync(ca)
	};
*/
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
//var ps=new PS(DB_URL);//+dop_ssl);

pool.on('connect', function(client){})
pool.on('error', function(err, client){console.log('db err in pool: ', err.name)})
pool.on('acquire', function(client){})

const gr="\x1b[32m";
const rs="\x1b[0m";

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

var test_btc_address;
var btc_address;
var btc_percent;
var btc_pay=false;
var is_test_btc=true;
var xirsys;
//var banner;

app.use(async (ctx, next)=>{
console.log("FROM HAUPT MIDDLEWARE =>",ctx.path, ctx.method);

ctx.db=pool;
ctx.state.btc_pay= btc_pay;
ctx.state.is_test_btc = is_test_btc;

ctx.state.test_btc_address = test_btc_address;
ctx.state.btc_address = btc_address;
ctx.state.btc_percent = btc_percent;
ctx.state.xirsys=xirsys;

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


}else if(ctx.path=='/api/set_xirsys'){
	let {xir}=ctx.request.body;
	xirsys=xir;
	ctx.state.xirsys=xirsys;
	}else{}

}

if(ctx.method=="GET"){
	//console.log("REKLAMA GET");
	/*
	try{
var ban=await pool.query("select*from reklama where statu=2");
ctx.state.banner=ban.rows;	
}catch(e){
	console.log("banner error: ", e);
	}
	*/ 
}
await next();	
})

app.use(pubrouter.routes()).use(pubrouter.allowedMethods());

app.use(adminrouter.routes()).use(adminrouter.allowedMethods());


app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);

try{
await next();

//if(ctx.status === 404) //ctx.throw(404, "fuck not found",{user:"fuck userss"});
}catch(err){
//ctx.status=err.status || 500;
//console.log('THIS>STATUS: ', ctx.status);
console.log("error",err);
if(ctx.status=== 404){
ctx.session.error='not found';
console.log('method: ', ctx.method, 'ctx.url: ', ctx.url);
if(!ctx.state.xhr)ctx.body=await ctx.render("error",{});
return;

}


}

});

app.on('error', function(err, ctx){
console.log('APP ERROR: ', err.message, 'ctx.url : ', ctx.url);
});

pg_store.setup().then(on_run).catch(function(err){console.log("err setup pg_store", err.name,'\n',err);});

function on_run(){

pool.query("delete from room",[], function(err,res){
if(err)console.log(err);	
});
pool.query("select*from prim_adr where type=true",[], 
function(err,res){if(err)console.log(err);
//console.log("RESPONES ", res.rows);
if(res && res.rows.length)test_btc_address=res.rows[0].adr;
});
pool.query("select*from prim_adr where type=false",[], 
function(err,res){if(err)console.log(err);
//console.log("RESPONES ", res.rows[0].adr);
if(res && res.rows.length)btc_address=res.rows[0].adr;
});
}
var servak;
if(is_ssl_http){
	const ssl_options={
	key: fs.readFileSync(dkey),
	cert: fs.readFileSync(dcert),
	ca: fs.readFileSync(ca)
	};
	servak = https.createServer(ssl_options, app.callback()).listen(SPORT);
	console.log("Must on, port: https://127.0.0.1:", SPORT, " started.");
}else{
	servak = app.listen(process.env.PORT || HPORT);
	console.log("Must on http or localhost, port: ", HPORT, " started.");
}
const wss=new WebSocket.Server({server:servak});

/* HELPERS FOR WS */
/*
function broadcast_to_all_no_me(ws, obj){
wss.clients.forEach(function(el){
if(el !==ws && el.readyState===WebSocket.OPEN){
if(el.url == ws.url)el.send(JSON.stringify(obj));	
}
})	
}
*/
function insert_message(msg,nick,us_id){
	pool.query('insert into chat(msg, us_id, nick) values($1,$2,$3)',[msg,us_id,nick],function(er,r){
	if(er)console.log(er);	
	})
}
function send_history(ws,room_id){
pool.query('select*from chat where us_id=$1',[room_id],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length>0){
wsend(ws, {type:"history",d:r.rows})
}
})	
}
function broadcast_room(ws, obj){
wss.clients.forEach(function(el){
if(el.url == ws.url)wsend(el,obj);	
})	
}
//todo reinvestigate who online
function who_online(obj){
for(var el of wss.clients){
if(el.url == "/gesamt")wsend(el,obj)
}
}

function send_to_one(ws,nick,msg){
for(var el of wss.clients){
if(el.nick == nick){
wsend(el, msg);
return;
}
}
//not found, offline?
if(msg.type=="offer")wsend(ws,{type:"no_target", who:msg.target,ontype:msg.type});
}

function get_user_count(url){
let user_count=0;
for(var el of wss.clients){
if(el.url==url){
console.log(el.url,url);
user_count++;
}
}
return {user_count};	
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

/*

ps.addChannel('events', function (msg){
console.log('msg: ', msg);
console.log('table: ', msg.table);
send_to_all(wss, msg.data);// may be to defined room?
});
ps.addChannel('on_smart_cb', function(msg){
console.log('msg notify: ',msg);
msg.data.type="on_btc";
broadcast_satoshi(msg.data);
});
*/

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

ws.owner=false;//if an owner 
ws.url=req.url;// url = us_id = room_id
ws.nick=shortid.generate();//nick or unique string for anons
if(req.url !== "/gesamt"){
console.log("hi from server");
send_history(ws,req.url.substring(1))
let siska=get_user_count(ws.url);
wsend(ws, {type:"nick", nick: ws.nick, msg: "Hi from server!"});
broadcast_room(ws, {type: "count",user_count:siska.user_count});
}else{}

ws.isAlive=true;
ws.on('pong',heartbeat);

ws.on('message',function sock_msg(msg){
var send_to_client=0;
let l;
try{
l=JSON.parse(msg);	
}catch(e){return;}

if(l.type=="msg"){
}else if(l.type=="username"){
console.log(l);
//send_history(ws,l.roomname);
ws.owner=l.owner;
ws.nick=l.name;
ws.roomname=l.roomname;//for satoshi
var blin_id=ws.url.substring(1);
if(l.owner){
broadcast_room(ws, {type: "owner_in",nick:ws.nick});
insert_message('вошел в чат.',l.name,blin_id);

console.log('blin_id: ',blin_id);
pool.query('insert into room(us_id,nick) values($1,$2) on conflict(nick) do nothing returning *',[blin_id, l.roomname],
function(er,r){if(er)console.log(er);
if(r.rows && r.rows.length){
let s3='select us_id,nick,v,age,ava,isava from room left join profile on room.nick=profile.bname where room.nick=$1;';
pool.query(s3,[l.name],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length){
let d4=r.rows[0];
d4.type="new_room";
who_online(d4);
}	
})
}
});
}else{
if(ws.url !=="/gesamt"){
pool.query('update room set v=v+1 where nick=$1 returning us_id,v',[l.roomname],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length){
let d5={};
d5.type="room_part";
d5.part=r.rows[0].v;
d5.roomid=r.rows[0].us_id;
who_online(d5);	
}
})
}
}
send_to_client=1;
}else if(l.type=="candidate"){

}else if(l.type=="offer"){

}else if(l.type=="answer"){

}else if(l.type == "roomnot"){

}else{}


if(send_to_client==0){
if(l.target && l.target !==undefined && l.target.length !==0){
// ws,nick,msg
console.log('send to one: ',l.type);
send_to_one(ws,l.target,l);	
}else{
broadcast_room(ws, l);
console.log('l.msg: ',l, ' ',ws.url.substring(1));
insert_message(l.msg,ws.nick,ws.url.substring(1));
}
}
});
//ws.on('error', function(er){console.log("websock err: ", err);})

ws.on('close', function(){
console.log("websocket closed");
if(ws.owner){
broadcast_room(ws, {type: "owner_out",nick:ws.roomname});
insert_message('покинул чат.',ws.roomname,ws.url.substring(1));
pool.query('delete from room where nick=$1',[ws.roomname],function(er,r){
if(er)console.log(er)
	let d6={};
	d6.type="out_room";
	d6.roomid=ws.url.substring(1);
	who_online(d6);
});
}else{
if(ws.url !== "/gesamt"){
pool.query('update room set v=v-1 where nick=$1 returning us_id,v',[ws.roomname],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length){
	let d9={};
	d9.type="room_part";
	d9.part=r.rows[0].v;
    d9.roomid=r.rows[0].us_id;
    who_online(d9);	
}
});	

}
}
if(ws.url=="/gesamt")return;
let siska=get_user_count(ws.url);
broadcast_room(ws, {type: "count",user_count:siska.user_count});
})

})

//}



function broadcast_satoshi(obj){
wss.clients.forEach(function each(client){
if(client.roomname == obj.nick){
wsend(client,obj);
insert_message(' шлет '+obj.btc_amt+' сатоши.','Анон',client.url.substring(1));
}
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
//grant all privileges on table x to suka
