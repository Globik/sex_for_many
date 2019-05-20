const adr='ipc:///tmp/janus.ipc';
const Koa=require('koa');
const PORT=3000;
const WebSocket=require('ws');//'/home/globik/alikon/node_modules/ws');
const koaBody=require('koa-body');
//const render=require('koa-rend');
const serve=require('koa-static');
const Router=require('koa-router');

const nano=require('nanomsg');
const sub=nano.socket('pair');


const unix_sock_path=adr; 
const EventEmitter=require('events');
const ev=new EventEmitter();

const app=new Koa();
const pub_router=new Router();

sub.connect(unix_sock_path);




app.use(serve(__dirname+'/html'));
// http://localhost:3000/videoBroadcast.html
//render(app,{root:'views', development:true});
app.use(koaBody());
/*
pub_router.get('/',async ctx=>{
ctx.body=await ctx.render('seqpacket',{})
})
*/ 
const gr="\x1b[32m";
const rs="\x1b[0m";
const vroom=new Map();
pub_router.post('/testEvent', async function food(ctx){

console.log("event_body ", gr, JSON.stringify(ctx.request.body) ,rs);
let d=ctx.request.body;
d.forEach(function(el){
if(el.type==64){
//room created or destroyed events
let a=el.event.data.event;
if(!a){console.log("no data event");return;}
let rid=el.event.data.room;
if(a=="created"){
if(!vroom.has(rid)){
console.log("no room, adding one: ",el.event.data.room);
vroom.set(rid,{sid:el.session_id,hid:el.handle_id});
console.log("vroom size: ", vroom.size);
}
}else if(a=="destroyed"){
if(vroom.has(rid)){
console.log("room for destroying: ", rid);
vroom.delete(rid);
console.log("vroom size: ", vroom.size);	
}
}	
}	
})
ctx.body={info:"ok"}	
})
//room created:
//[{"emitter":"MyJanusInstance","type":64,"timestamp":1556716877373518,
//"session_id":7921853226865960,"handle_id":5868099884063956,"opaque_id":"fucker",
//"event":{"plugin":"janus.plugin.videoroom","data":{"event":"created","room":6666}}}] 
// room destroyd
//[{"emitter":"MyJanusInstance","type":64,"timestamp":1556717692947533,
//"session_id":1661877796617130,"handle_id":2268050969731239,"opaque_id":"fucker",
//"event":{"plugin":"janus.plugin.videoroom","data":{"event":"destroyed","room":6666}}}] 


app.use(pub_router.routes()).use(pub_router.allowedMethods())
app.on('error',(err,ctx)=>{console.log(err.message,ctx.request.url)})

const servak=app.listen(PORT);
const wss=new WebSocket.Server({server:servak})

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
//wss.clients.forEach(function(el){
//console.log('el trans', el.trans);
if(el.trans==trans){
console.log("Yes. It's target trans! ",el.trans, trans,'el.sid ', el.sid,' sid ', sid);
//el.owner=owner;
//el.feed=feed;
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

function broadcast_new_room(obj){
console.log("broadcast_new_room(): ");
for(var el of wss.clients){
if(el.url == "/gesamt"){
console.log("Yes, its matches. ",el.url);
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
//break;	
}	
}
}
function broadcast_room_gone(obj){
console.log("broadcast_room_gone(): ");
for(var el of wss.clients){
if(el.url == "/gesamt"){
console.log("Yes, its matches. ",el.url);
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
//break;	
}	
}
}

const droom=new Map();

sub.on('data',function(msg){
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
sess=2;//ws.sid=0
}else if(c==40){
//create room
//console.log(l);
if(l.plugindata.data.videoroom=="created"){
//varowner=true;
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
//pong
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
//ev.on('janus_msg',on_janus_msg);

wss.on('connection', function(ws,req){
console.log("websock client opened!", req.url);
ws.trans=null;
ws.sid=0;
ws.hid=0;
ws.owner=false;
ws.roomid=0;
ws.feed=0;
ws.url=req.url;

if(req.url !== "/gesamt")wsend({typ:"usid", msg: "Hi from server!"});
ws.on('message', function d_msg(msg){
//console.log("msg came: ", msg);
let l;var sens_to_clients=0;
try{
l=JSON.parse(msg);	
}catch(e){return;}
if(l.janus){
sub.send(msg);
send_to_clients=1;
}
if(l.typ=="onuser"){
console.log("Typ: ", l.typ);
console.log('l: ',l);
ws.trans=l.username;
ws.owner=l.owner;

ws.roomid=l.roomid;
send_to_clients=1;	
}else if(l.typ=="onair"){
console.log("ON AIR!");
l.typ="atair";//for subscribers signal
broadcast_room_no_me(ws, l);
broadcast_new_room(l);
send_to_clients=1;	
}else if(l.typ=="outair"){
//publisher unpublished the stream. Notify all about it
l.typ="outair";
broadcast_room_no_me(ws,l);
broadcast_room_gone(l);
send_to_clients=1;	
}else{}

if(send_to_clients==0){
ws.send(msg);	
}
})
ws.on('close',function(){
console.log('ws closed, owner: ',ws.owner);
if(ws.owner){
console.log("It's OWNER!");
console.log('room size: ',droom.size);
console.log("vroom size: ", vroom.size);
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
/*
let d2={};
d2.handle_id=b.handle_id;
d2.transaction=ws.trans+"_13";
d2.session_id=b.session_id;
d2.janus="detach";
d2.plugin="janus.plugin.videoroom";
d2.opaque_id="fucker";
subsend(d2);

let d3={};
d3.transaction=ws.trans+"_11";//"session_destroy";
d3.session_id=b.session_id;
d3.janus="destroy";
subsend(d3);
*/ 
console.log("DELETING ROOM=> ",ws.roomid, ' ',b.session_id,' ',b.handle_id);
droom.delete(ws.roomid);
}	
}
})

function wsend(ob){
let a;
try{a=JSON.stringify(ob);}catch(e){retrun;}	
if(ws && ws.readyState==1)ws.send(a);
}



})

console.log("localhost:",PORT,"/videoBroadcast.html")

function subsend(ob){
let a;
try{a=JSON.stringify(ob);sub.send(a);}catch(e){retrun;}	
}

