// which psql 
// heroku pg:psql --app frozen-atoll-47887
// sudo mkdir /var/run/pgsql
//ctrl+alt+T
// ssh root@91.217.80.183 (globikon.space) vds1974028.my-ihor.ru
// sudo rm -r /home/globik/atar/tox remove recursivly folder tox
// cp -r .config/tox /home/globik/atar/ copy folder tox to dir  atar
// sudo cp .config/tox/* /home/globik/atar/ copy all files from dir tox to dir atar
const proc = process.env.DEVELOPMENT;
const ORIGINAL="https://globikon.space";
//console.log('proc: ', proc);
var HPORT = 80;
var SPORT = 443;
var is_ssl_http = true;
var DB_URL = 'postgress://globi:globi@127.0.0.1:5432/globi';// for globikon
if(proc=="yes"){
 HPORT = 3000;
 SPORT = 8000;
 is_ssl_http = false;
 DB_URL = 'postgress://globik:null@localhost:5432/test';
 //DB_URL='postgress://globi:null@localhost:5432/globi';
}else{}


const https = require('https');
const fs = require('fs');

//const DB_URL = 'postgress://globik:null@localhost:5432/test';
//const DB_URL=process.env.DATABASE_URL;//for heroku
//const DB_URL = 'postgress://suka:suka@127.0.0.1:5432/globi';// for gayroom.ru

const path=require('path');
const util=require('util');
const readdir=util.promisify(fs.readdir);
const lstat=util.promisify(fs.lstat);
const unlink=util.promisify(fs.unlink);
const rmdir=util.promisify(fs.rmdir);
const access=util.promisify(fs.access);
const mkdir=util.promisify(fs.mkdir);
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
const PS = require('pg-pubsub');
const pgtypes = require('pg').types;
const render = require('koa-rend');
const serve = require('koa-static');
const session = require('koa-generic-session');

const nodemailer = require('nodemailer');

const pubrouter = require('./routes/pubrouter.js');
const adminrouter = require('./routes/adminrouter.js');
const {meta, warnig, site_name} = require('./config/app.json');

const dkey='./data/glo_key.pem';
const dcert='./data/glo_cert.pem';
const ca='./data/glo_ca.cert';

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str=>str);
const pars = url.parse(DB_URL);
const cauth = pars.auth.split(':');
const pg_opts = { user:cauth[0],password:cauth[1],host:pars.hostname,port:pars.port,database:pars.pathname.split('/')[1],
	ssl:false
	//Client:pgn
	};
const pool = new Pool(pg_opts);
const pg_store = new PgStore(pool);
var dop_ssl = "";
if(process.env.DEVELOPMENT === "yes"){
	
}else{dop_ssl = "?ssl=true";}
var ps=new PS(DB_URL);//+dop_ssl);

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
ctx.state.xhr = (ctx.request.get('X-Requested-With') === 'XMLHttpRequest')
await next()
}
}
app.use(xhr());

const removeDir = async(dir)=>{
try{
const files = await readdir(dir);
await Promise.all(files.map(async file=>{
try{
let p = path.join(dir,file);
let stat = await lstat(p);
if(stat.isDirectory()){
await removeDir(p);	
}else{
await unlink(p);	
}	
}catch(e){console.log(e)}	
}))
console.log('dir:',dir);
if(dir == 'public/video'){}else{
await rmdir(dir);
}
}catch(e){
console.log(e);	
}	
}


var transporter;

var test_btc_address;
var btc_address;
var btc_percent;
var btc_pay = false;
var is_test_btc = false;
var xirsys;
var ya_sec;
var xir_sec;
//var banner;

app.use(async (ctx, next)=>{
console.log("FROM HAUPT MIDDLEWARE =>",ctx.path, ctx.method);

ctx.state.site = site_name;
ctx.db = pool;
ctx.transporter = transporter;
ctx.state.meta = meta;
ctx.state.warnig = warnig;
ctx.state.btc_pay = btc_pay;
ctx.state.is_test_btc = is_test_btc;
ctx.is_test_btc = is_test_btc;

ctx.state.test_btc_address = test_btc_address;
ctx.state.btc_address = btc_address;
ctx.test_btc_address = test_btc_address;
ctx.btc_address = btc_address;
ctx.state.btc_percent = "10%";
ctx.state.xirsys = xirsys;

ctx.ya_sec = ya_sec;
ctx.xir_sec = xir_sec;

if(ctx.request.header["user-agent"]){
	ctx.session.ua = ctx.request.header["user-agent"];
	ctx.session.ref = ctx.request.header["referer"];
	//console.log("REQUEST: ", ctx.request.header);
	}

if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
if(ctx.path == "/home/profile/enable_btc"){
console.log("occured /home/profile/enable_btc");
if(!btc_pay){
btc_pay = true;
ctx.state.btc_pay = btc_pay;
}else{btc_pay = false;ctx.state.btc_pay = btc_pay;}

}else if(ctx.path == "/home/profile/btc_test"){
if(is_test_btc){
is_test_btc = false;	
ctx.state.is_test_btc = is_test_btc;
ctx.is_test_btc = is_test_btc;
}else{
is_test_btc = true;
ctx.state.is_test_btc = is_test_btc;	
ctx.is_test_btc = is_test_btc;
}
}else if(ctx.path == "/home/profile/set_btc_adr"){
console.log("BBBBBBBBBBBBBBBBBody: ",ctx.request.body);
//let {test}=ctx.request.body;
//if(test){
test_btc_address = ctx.request.body.test_btc_adr;
ctx.state.test_btc_address = test_btc_address;
try{
//await pool.query("update prim_adr set tadr=$1",[test_btc_address])	
}catch(e){}
//}else{
btc_address = ctx.request.body.btc_adr;
console.log('btc_address: ',btc_address);
ctx.state.btc_address = btc_address;
try{
//await pool.query("update prim_adr set adr=$1",[btc_address])	
}catch(e){}	
//}
btc_percent = ctx.request.body.percent;
ctx.state.btc_percent = btc_percent;


}else if(ctx.path == "/home/profile/SET_BTC_ADDRESS"){
	console.log("CTX>REQUEST>BODY: ", ctx.request.body);
test_btc_address = ctx.request.body.test_btc_address;
ctx.test_btc_address = test_btc_address;	
btc_address = ctx.request.body.btc_address;
console.log('btc_address++: ',btc_address);
ctx.btc_address = btc_address;
}else if(ctx.path == '/api/set_xirsys'){
	let {xir} = ctx.request.body;
	xirsys = xir;
	ctx.state.xirsys = xirsys;
	try{
	await pool.query(`update prim_adr set xir=$1`, [JSON.stringify(xirsys)])
}catch(e){console.log(e);}
	}else if(ctx.path == "/api/set_ya_sec"){
		let {yasec} = ctx.request.body;
		ya_sec = yasec;
		ctx.ya_sec = ya_sec;
		try{
			await pool.query('update prim_adr set ya_sec=$1', [ya_sec])
			}catch(e){
				console.log(e);
				}
		}else if(ctx.path == "/api/set_xir_sec"){
			let {xirsec} = ctx.request.body;
			xir_sec = xirsec;
			ctx.xir_sec = xir_sec;
			try{
				await pool.query('update prim_adr set xir_sec=$1', [xir_sec])
			}catch(e){
				console.log(e);
				}
			}else{}

}

if(ctx.method == "GET"){
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

async function on_run(){
	
/* pool.query("select on_token_transfer('Globi','dima',30)",function(e,result){
	if(e){console.log('mi err: ',e.detail); return;}
	console.log('result: ',result.rows);
	console.log('result minus: ',result.rows[0].on_token_transfer);
	console.log('result plus: ',result.rows[1].on_token_transfer);
	}) */ 
	
try{
let a=await pool.query('select * from prim_adr');
if(a&&a.rows.length){
	xirsys = a.rows[0].xir;
	console.log('xirsys: ',xirsys);
	test_btc_address = a.rows[0].tadr;
	console.log('test_btc_address: ',test_btc_address);
	btc_address = a.rows[0].adr;
	console.log('btc_address: ',btc_address);
	is_test_btc = a.rows[0].type;
	console.log('is_test_btc: ',is_test_btc);
	ya_sec = a.rows[0].ya_sec;
	xir_sec = a.rows[0].xir_sec;

	transporter = nodemailer.createTransport(
{
//service:'gmail',
//auth:{user: GMAIL,pass: GMAILPASS}
sendmail:true,
newline: 'unix',
path:'/usr/sbin/sendmail'
	} 
)
}	
}catch(e){console.log('prim_adr err: ',e);}
	

//activ or all or priv
pool.query("delete from vroom where not typ='fake'",[],function(err,res){
if(err)console.log(err);	
})
try{
let l=await access('public/video/', fs.constants.F_OK);
console.log('if file exists?: ', l);
removeDir(path.join('public','video')).then(function(d){console.log('d: ',d)}).catch(function(e){console.log(e);});
		}catch(e){
console.log('haha: ',e);
try{
await mkdir('public/video/');
}catch(e){console.log('err in mkdir: ',e)}	
//console.log('trying delete public/video');
//removeDir(path.join('public','video')).then(function(d){console.log('d: ',d)}).catch(function(e){console.log(e);});

}
try{
let a=await access('public/uploads/tmp',fs.constants.F_OK);
console.log('a: ',a);	
}catch(e){
try{
await mkdir('public/uploads/tmp');
console.log('created directory public/uploads/tmp')
}catch(e){console.log(e)}	
}

try{
let a_1=await access('public/images/upload/tmp',fs.constants.F_OK);
console.log('images/upload/tmp: ',a_1);	
}catch(e){
try{
await mkdir('public/images/upload/tmp');
console.log('created directory public/images/upload/tmp')
}catch(e){console.log(e)}	
}

try{
let b=await access('public/vid',fs.constants.F_OK);
console.log('b: ',b);	
}catch(e){
try{
await mkdir('public/vid');
console.log('created directory public/vid')
}catch(e){console.log(e)}	
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
const wss=new WebSocket.Server({server:servak,verifyClient:(info,cb)=>{
	console.log('info.origin: ',info.origin);
if(process.env.DEVELOPMENT==="yes"){cb(true);return;}else{
if(info.origin===ORIGINAL){cb(true);return;}
cb(false);
	}
	}});


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
	console.log("MSG: ",msg,nick,us_id);
	pool.query('insert into chat(msg, us_id, nick) values($1,$2,$3)',[msg,us_id,nick],function(er,r){
	if(er)console.log(er);	
	})
}
function send_history(ws,room_id){
pool.query('select*from chat where us_id=$1 order by tz',[room_id],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length > 0){
wsend(ws, {type:"history",d:r.rows})
}
})	
}
function broadcast_room(ws, obj){
wss.clients.forEach(function(el){
if(el.urli == ws.urli)wsend(el,obj);	
})	
}
//todo reinvestigate who online
function who_online(obj){
for(var el of wss.clients){
if(el.urli == "/gesamt")wsend(el,obj)
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
if(msg.type=="privat_wanted")wsend(ws,{type:"no_target", who:msg.target,ontype:msg.type});
}

function get_user_count(url){
let user_count=0;
let on_vair=false;
let online=false;
let privat=false;
for(var el of wss.clients){
if(el.urli==url){
console.log(el.urli,url);
user_count++;
if(el.on_vair){on_vair=el.on_vair;}
if(el.owner){online=el.owner;}
if(el.privat){privat=el.privat;}
console.log('el.ON_VAIR: ',el.on_vair);
}
}
return {user_count,on_vair,online,privat};	
}
function send_to_url(msg, url){
console.log('send to url():',url)
var cnt = get_user_count(url);// how much users and viewers in a chat room
for(var el of wss.clients){
if(el.urli == url){
if(el.readyState===WebSocket.OPEN){
try{
msg.user_count=cnt.user_count;
msg.viewers=cnt.viewers;
msg.on_vair=cnt.on_vair;
let a=JSON.stringify(msg);
el.send(a);
}catch(e){console.log(e);}
}
}
}
}



ps.addChannel('events', function (msg){
console.log('msg: ', msg);
//console.log('table: ', msg.table);
//send_to_all(wss, msg.data);// may be to defined room?
});
ps.addChannel('on_smart_cb', function(msg){
console.log('msg notify: ',msg);
msg.data.type="on_btc";
broadcast_satoshi(msg.data);
});
//perform pg_notify('token_buy', json_build_object('us_id', bitaps_cb.usid,'items', ptokens,'amt', bitaps_cb.amt)::text);
ps.addChannel('token_buy', function(msg){
console.log('token buy: ', msg);
//if(msg.data){
	msg.type = "token_buy";
	broadcast_tokens(msg);
//}
})
function broadcast_tokens(obj){
	console.log('broadcast_tokens');
	wss.clients.forEach(function each(client){
		console.log('client.urli: ', client.urli, 'obj.us_id: ', obj.us_id);
if(client.urli == `/${obj.us_id}`){
wsend(client,obj);
}
})
}
function broadcast_satoshi(obj){
	console.log('obj: ',obj);
wss.clients.forEach(function each(client){
if(client.roomname == obj.nick){
wsend(client,obj);
if(obj.btc_amt > 0){insert_message(' шлет '+obj.btc_amt+' сатоши.','Анон',client.url.substring(1));}
}
})
}
function broadcasti(obj){
wss.clients.forEach(function(client){
wsend(client, obj);
})	
}

function noop(){}
const interval=setInterval(function ping(){
wss.clients.forEach(function each(ws){
if(ws.isAlive===false)return ws.terminate();
ws.isAlive=false;
ws.ping(noop);	
})	
},30000)
function heartbeat(){this.isAlive=true;}
wss.on('close',function close(){
	clearInterval(interval);
	})
wss.on('connection', function(ws, req){
console.log("websock client opened!", req.url);
broadcasti({type: "spanWhosOn", cnt: wss.clients.size});
//console.log("clients: ", wss.clients.size);
ws.owner=false;//if an owner 
ws.on_vair=false;
ws.privat=false;
//ws.url=req.url;// url = us_id = room_id
ws.urli=req.url;
console.log("WS URL: ", ws.urli,req.url);
ws.nick=shortid.generate();//nick or unique string for anons
if(req.url !== "/gesamt"){
console.log("hi from server");
send_history(ws,req.url.substring(1))
let siska=get_user_count(ws.urli);
wsend(ws, {type:"nick", nick: ws.nick, msg: "Hi from server!"});
broadcast_room(ws, {type: "count",user_count:siska.user_count,on_vair:siska.on_vair,online:siska.online,privat:siska.privat});
}else{}

ws.isAlive=true;
ws.on('pong',heartbeat);

ws.on('message', async function sock_msg(msg){
	console.log('json:',msg)
var send_to_client=0;
let l;
try{
l=JSON.parse(msg);	
}catch(e){return;}
try{
if(l.type=="msg"){
}else if(l.type=="username"){
console.log(l);
//send_history(ws,l.roomname);
ws.owner=l.owner;
ws.nick=l.name;
ws.roomname=l.roomname;//for satoshi
console.log('blin_id: ',ws.urli)
var blin_id=ws.urli.substring(1);
//console.log('blin_id: ',blin_id,ws.url)
if(l.owner){
broadcast_room(ws, {type: "owner_in",nick:ws.nick});
insert_message('вошел в чат.',l.name,blin_id);

console.log('blin_id: ',blin_id);

console.log("L: ",l);
l.type="new_room";
l.room_name=l.roomname;
l.room_id=blin_id;
l.v=1;
try{
await pool.query('insert into vroom(us_id,nick) values($1,$2) on conflict(nick) do nothing',[blin_id,l.room_name]);
}catch(e){console.log('db.error inserting vroom: ',e)}
try{
let q=await pool.query('select ava,stat from buser where bname=$1',[l.room_name]);
if(q.rows&&q.rows.length){
l.src=q.rows[0].ava;
l.descr=q.rows[0].stat;
who_online(l);	
}
}catch(e){console.log(e);}
}else{
if(ws.urli !=="/gesamt"){
pool.query('update vroom set v=v+1 where nick=$1 returning us_id,v,crat',[l.roomname],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length){
let d5={};
d5.type="room_part";
d5.part=r.rows[0].v;
d5.roomid=r.rows[0].us_id;
d5.min_t=get_mini(r.rows[0].crat).t;
d5.min_s=get_mini(r.rows[0].crat).s;
who_online(d5);	
}
})
}
}
send_to_client=1;
}else if(l.type=="tokentransfer"){
console.log('kuku2!: ',l);	
try{
	//on_token_transfer(tom varchar(16),fro varchar(16), amt int)
//await pool.query('select on_token_transfer($1,$2,$3)',[l.modelname,l.from,l.amount]);
//broadcast_room(ws, l);
let li=await pool.query('select on_token_transfer($1,$2,$3)',[l.modelname,l.from,l.amount]);
if(li.rows&&li.rows.length){
	l.minus=li.rows[0].on_token_transfer;
	l.plus=li.rows[1].on_token_transfer;
	broadcast_room(ws, l);
	
	}
/*
pool.query("select on_token_transfer('Globi','dima',30)",function(e,result){
	if(e){console.log('mi err: ',e.detail); return;}
	console.log('result minus: ',result.rows[0].on_token_transfer);
	console.log('result plus: ',result.rows[1].on_token_transfer);
	}) */
}catch(e){console.log('db er: ',e)}
send_to_client=1;
}else if(l.type=="on_vair"){
console.log("ON VAIR: ");
if(l.is_first=='true'){
	try{
		await pool.query(`update vroom set typ='all', p=$1 where nick=$2`,[l.src,l.room_name]);
		}catch(e){console.log(e);}
ws.on_vair=true;
who_online(l);
}

broadcast_room(ws, l);
if(l.is_active=='false'){
	
	try{
		let a=await pool.query(`update vroom set typ='activ' where nick=$1`,[l.room_name]);
	
		}catch(e){console.log(e);}
l.type="out_vair2";
try{
let a=await pool.query('select ava from buser where bname=$1',[l.room_name]);
if(a.rows&&a.rows.length){
l.src=a.rows[0].ava;
}
}catch(e){console.log(e)} 
who_online(l);	

}
send_to_client=1;
}else if(l.type=="out_vair"){
ws.on_vair=false;
broadcast_room(ws,l);
send_to_client=1;
}else if(l.type=="privat"){
	try{
		await pool.query(`update vroom set typ='priv' where nick=$1`,[l.modelname]);
		broadcast_room(ws,l);
		who_online(l);
		}catch(e){console.log('err in privat: ',e);}
send_to_client=1;	
}else if(l.type=="unprivat"){
	try{
		await pool.query(`update vroom set typ='activ' where nick=$1`,[l.modelname]);
		broadcast_room(ws,l);
		who_online(l);
		}catch(e){console.log('err in unprivat: ',e);}
send_to_client=1;	
}else if(l.type=="new_ava"){
who_online(l);
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
console.log('l.msg: ',l, ' ',ws.urli.substring(1));
insert_message(l.msg,ws.nick,ws.urli.substring(1));
}
}
}catch(e){console.log("ERR IN WEBSOCK MSG: ",e);}
});


ws.on('close', async function(){
console.log("websocket closed");
broadcasti({type: "spanWhosOn", cnt: wss.clients.size});
if(ws.owner){
broadcast_room(ws, {type: "owner_out",nick:ws.roomname});
insert_message('покинул чат.',ws.roomname,ws.urli.substring(1));
//pool.query('delete from room where nick=$1',[ws.roomname],function(er,r){
//if(er)console.log(er)
	let d6={};
	d6.type="out_room";
	d6.roomid=ws.urli.substring(1);
	//who_online(d6);
	if(ws.on_vair){
//{"type":"out_vair","is_first":"false","is_active":"false","vsrc":"/video/Globi/Globi_9.webm","room_id":"1","room_name":"Globi"}

//	who_online({type:"out_vair",room_name:ws.roomname,room_id:ws.url.substring(1)})
//pool.query('delete from vroom where nick=$1',[ws.roomname],function(er,r){
	//if(er)console.log(er);
	removeDir(path.join('public','video/')+ws.roomname).then(function(d){console.log('d: ',d)}).catch(function(e){console.log(e);});
	//});
		}
		who_online({type:"out_vair",room_name:ws.roomname,room_id:ws.urli.substring(1)});
		broadcast_room(ws,{type:"out_vair",piska:"piska"});
		try{
await pool.query(`delete from vroom where nick=$1 and not typ='fake'`,[ws.roomname]);
//delete from vroom where not typ='fake'
// 23 | mickey | mickey.webm | mickey.jpg | 2020-12-19 13:16:02.642671 | fake |1 | 
//ssh root@91.217.80.183
// insert into vroom(us_id,nick,src,p,v) values(60,'mickey','mickey.webm','mickey.jpg',1);

			}catch(e){console.log(e);}
//});
}else{
if(ws.urli !== "/gesamt"){
pool.query('update vroom set v=v-1 where nick=$1 returning us_id,v,crat',[ws.roomname],function(er,r){
if(er)console.log(er);
if(r.rows && r.rows.length){
let d9={};
d9.type="room_part";
d9.part=r.rows[0].v;
d9.roomid=r.rows[0].us_id;
d9.min_t=get_mini(r.rows[0].crat).t;
d9.min_s=get_mini(r.rows[0].crat).s;
who_online(d9);	
}
});	

}
}
if(ws.urli=="/gesamt")return;
let siska=get_user_count(ws.url);
broadcast_room(ws, {type: "count",user_count:siska.user_count});
})

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

function get_mini(crat){
let a=new Date(crat).getTime();
let b=new Date().getTime();
let d=(b-a)/60000;
let c=Math.round(d);
if(c>=60){
console.log((c/60).toFixed(2),' hours');
return {t:(c/60).toFixed(2), s:'ч'}
}else{
console.log(c, ' min')
return {t: c, s: 'мин'}	
}	
}
process.on('unhundledRejection', function(reason, p){
console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});	
// sudo mkdir /var/run/pgsql
//grant all privileges on table x to suka

/* cat /etc/hosts
127.0.0.1 localhost localhost 
91.217.80.183 globikon.space mail
 # The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
 * 
 * 
 * 
 */
