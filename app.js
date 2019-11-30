// which psql 
//heroku pg:psql --app frozen-atoll-47887

const HPORT = 3000;
//const DB_URL='postgress://globik:null@localhost:5432/test';
const DB_URL=process.env.DATABASE_URL;//for heroku
const koaBody=require('koa-body');


const Koa=require('koa');
//const koaBody=require('koa-body');
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

app.use(async (ctx, next)=>{
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

app.use(pubrouter.routes()).use(pubrouter.allowedMethods());

app.use(adminrouter.routes()).use(adminrouter.allowedMethods());

app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);

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
}
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

function send_target(msg, url){
for(var el of wss.clients){
if(el.url == url){
if(el.readyState===WebSocket.OPEN)el.send(msg);
}
}
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
console.log("hi from server")
let siska=get_user_count(ws.url)
wsend(ws, {type:"nick", nick: ws.nick, msg: "Hi from server!", user_count:siska.user_count});
//send_to_url({typ: "joinchat"}, req.url);//owner joined
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
ws.owner=l.owner;
ws.nick=l.name;
ws.roomname=l.roomname;//for satoshi
send_to_client=1;
}else if(l.type=="on_"){

}else if(l.type=="outair"){

}else if(l.type=="roomok"){

}else if(l.type == "roomnot"){

}else{}


if(send_to_client==0)broadcast_room(ws, l);//ws.send(msg);
});
//ws.on('error', function(er){console.log("websock err: ", err);})

ws.on('close', function(){
console.log("websocket closed");
})

})

//}



function broadcast_satoshi(obj){
wss.clients.forEach(function each(client){
if(client.roomname == obj.bname)wsend(client,obj);
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
