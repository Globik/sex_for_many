//hallo!
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

const gr="\x1b[32m";
const rs="\x1b[0m";
const vroom=new Map();
const feeds=new Map();
pub_router.post('/testEvent', async function food(ctx){

console.log("event_body ", gr, JSON.stringify(ctx.request.body) ,rs);
let d=ctx.request.body;
d.forEach(function(el){
if(el.type==64){
//room created or destroyed or published events
let a=el.event.data.event;
if(!a){console.log("no data event");return;}
let rid = el.event.data.room;
let feed_id=el.event.data.id;
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
}else if(a=="published"){
feeds.set(rid,{feed:feed_id})
}	
}	
})
ctx.body={info:"ok"}	
})
//room created:
//[{"emitter":"MyJanusInstance","type":64,"timestamp":1556716877373518,
//"session_id":7921853226865960,"handle_id":5868099884063956,"opaque_id":"fucker",
//"event":{"plugin":"janus.plugin.videoroom","data":{"event":"created","room":6666}}}] 
//published
// [{"emitter":"MyJanusInstance","type":64,"timestamp":1560864728330905,
//"session_id":6575463149050305,"handle_id":2966073333370175,
//"opaque_id":"fucker","event":{"plugin":"janus.plugin.videoroom","data":{"event":"published","room":6666,"id":5046334534517545}}}] 

// room destroyd
//[{"emitter":"MyJanusInstance","type":64,"timestamp":1556717692947533,
//"session_id":1661877796617130,"handle_id":2268050969731239,"opaque_id":"fucker",
//"event":{"plugin":"janus.plugin.videoroom","data":{"event":"destroyed","room":6666}}}] 


app.use(pub_router.routes()).use(pub_router.allowedMethods())
app.on('error',(err,ctx)=>{console.log(err.message,ctx.request.url)})

const servak=app.listen(PORT);
const wss=new WebSocket.Server({server:servak})

function broadcast_to_all_no_me(ws, obj){
wss.clients.forEach(function(el){
if(el !==ws && el.readyState===WebSocket.OPEN){
if(el.url == ws.url)el.send(JSON.stringify(obj));	
}
})	
}


function send_target_trans(trans, obj, sid){
	//u nique name of websocket client
console.log("send_target_trans(): ", trans);
for(var el of wss.clients){
console.log("OF el.trans: ",el.trans);
if(el.trans==trans){
console.log("Yes. It's target trans! ",el.trans, trans,'el.sid ', el.sid,' sid ', sid);

if(sid == 1){
if(el.sid == 0){
el.sid=obj.data.id;
console.log("Attaching a session_id");// for webrtc sessions of janus
}
	
}else if(sid==2){console.log('Detaching a session id');el.sid=0}
console.log("NOW SENDING ",obj);
try{
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
}catch(e){}
break;	
}
}
}

function send_target_sess(session_id, obj){
//inform publisher webrtc feed is up
console.log("send_target_sess(): ", session_id);
for(var el of wss.clients){
if(el.sid == session_id){
console.log("Yes, session matches. ",el.sid, session_id);
try{
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
}catch(e){}
break;	
}	
}
}

function broadcast_room(obj){
console.log("broadcast_new_room(): ");
for(var el of wss.clients){
if(el.url == "/gesamt"){
console.log("Yes, its matches. ",el.url);
try{
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
}catch(e){}	
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
user_count++;
if(el.roomok){viewers++}
}
}
return {user_count, viewers};	
}
function send_to_url(msg, url){
var cnt=get_user_count(url);// how much users and viewers in a chat room
for(var el of wss.clients){
if(el.url == url){
if(el.readyState===WebSocket.OPEN){
try{
msg.user_count=cnt.user_count;
msg.viewers=cnt.viewers;
let a=JSON.stringify(msg);
el.send(a);
}catch(e){}
}
}
}
}

const droom=new Map();


sub.on('data',function(msg){
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
sess=2;//ws.sid=0
}else if(c==40){
//create room

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


wss.on('connection', function(ws, req){
console.log("websock client opened!", req.url);
ws.trans=null;//unique name
ws.sid=0;//session
ws.owner=false;//is a publisher 

ws.url=req.url;// url == room id == user id
ws.roomok=false;// is currently started subscriber
let feedi;
var roomi=Number(ws.url.substring(1));
if(feeds.has(roomi)){
	let feedy=feeds.get(roomi);
	feedi=feedy.feed;
}else{
feedi=0;
}
if(req.url !== "/gesamt")wsend({typ:"usid", msg: "Hi from server!", pubid:feedi});//for a user

ws.on('message', function d_msg(msg){
let l;
var send_to_clients=0;
try{
l=JSON.parse(msg);	
}catch(e){return;}
if(l.janus){
sub.send(msg);
send_to_clients=1;
}
if(l.typ=="msg"){
if(l.to){
send_target(msg, req.url);
send_to_clients=1;
}
	
}else if(l.typ=="onuser"){
//	console.log("req.url:",ws.url);
console.log("Typ: ", l.typ);
console.log('l: ',l);
ws.trans=l.username;
ws.owner=l.owner;
//ws.roomid=l.roomid;
send_to_clients=1;	
send_to_url({typ: "joinchat"}, ws.url)
}else if(l.typ=="onair"){
console.log("ON AIR!");
l.typ="atair";//for subscribers signal
broadcast_to_all_no_me(ws, l);
broadcast_room(l);
send_to_clients=1;	
}else if(l.typ=="outair"){
//publisher unpublished the stream. Notify all about it
l.typ="outair";
broadcast_to_all_no_me(ws,l);
broadcast_room(l);
send_to_clients=1;	
feeds.delete(roomi);
}else if(l.typ=="roomok"){
// subscriber starting in room
ws.roomok=true;	
send_to_url({typ: "joinchat"}, ws.url);
}else if(l.typ=="roomnot"){
ws.roomok=false;	
send_to_url({typ: "joinchat"}, ws.url);
}else{}

if(send_to_clients==0){
ws.send(msg);	
}
})
ws.on('close',function(){
console.log('ws closed, owner: ',ws.owner);
let roomid=Number(ws.url.substring(1));
send_to_url({typ: "joinchat"}, ws.url)

if(ws.owner){
console.log("It's OWNER!");
console.log('room size: ',droom.size);
console.log("vroom size: ", vroom.size);
console.log('ROOM ID: ',roomid);
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
subsend(d);// todo detach plugin and session destroy

console.log("DELETING ROOM=> ", roomid, ' ',b.session_id,' ',b.handle_id);
broadcast_to_all_no_me(ws, {typ:"outair"});
droom.delete(roomid);
broadcast_room({typ:"outair",roomid:roomid});
feeds.delete(roomid);
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

