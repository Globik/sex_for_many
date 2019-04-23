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
pub_router.post('/testEvent', async function food(ctx){
console.log("event_body", __filename,'\n', JSON.stringify(ctx.request.body));
ctx.body={info:"ok"}	
})

app.use(pub_router.routes()).use(pub_router.allowedMethods())
app.on('error',(err,ctx)=>{console.log(err.message,ctx.request.url)})

const servak=app.listen(PORT);
const wss=new WebSocket.Server({server:servak})

function broadcast_room_no_me(ws, obj){
wss.clients.forEach(function(el){
if(el !==ws && el.readyState===WebSocket.OPEN){
el.send(JSON.stringify(obj));	
}
})	
}


function send_target_trans(trans, obj, sid){
console.log("trg sessId: ", trans);
wss.clients.forEach(function(el){// better for k of wss.clients
if(el.trans==trans){
console.log("trg Yes. It's target! ",el.trans, trans);
if(sid==1){if(el.sid==0)el.sid=obj.data.id;}else if(sid==2){el.sid=0}
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));	
}	
});
}
function send_target_sess(session_id, obj){
console.log("send target sess: ", session_id);
//wss.clients.forEach(function(el){// better for k of wss.clients
for(var el of wss.clients){
if(el.sid== session_id){
console.log("Yes, session matches. ",el.sid, session_id);
if(el.readyState===WebSocket.OPEN)el.send(JSON.stringify(obj));
break;	
}	
}
//);
}


sub.on('data',function(msg){
console.log('data: ',msg.toString())
let abbi=msg.toString();

let l;
try{l=JSON.parse(abbi);}catch(e){console.log(e);return;}	
l.typ="janus";
let sess=0;
if(l.transaction){
let a=l.transaction.split("_");
let len=a.length;
l.transi=a[len-1];
let c=Number(a[len-1]);
if(c==10){
console.log("create session");
sess=1;//ws.sid=l.data.id => new session
}else if(c==1){
sess=2;//ws.sid=0
}
send_target_trans(a[len-2],l, sess);
}
if(l.janus=="media"){
console.log("media is here",l);	 
send_target_sess(l.session_id, l);
}
})
//ev.on('janus_msg',on_janus_msg);

wss.on('connection', function(ws,req){
console.log("websock client opened!");
ws.trans=null;
ws.sid=0;
ws.hid=0;


wsend({typ:"usid", msg: "Hi from server!"});
ws.on('message', function d_msg(msg){
console.log("msg came: ",msg);
let l;var sens_to_clients=0;
try{
l=JSON.parse(msg);	
}catch(e){return;}
if(l.janus){
sub.send(msg);
send_to_clients=1;
}
if(l.typ=="onuser"){
console.log("MSG type: ", l.type);
ws.trans=l.username;
send_to_clients=1;	
}else if(l.typ=="onair"){
l.typ="atair";//for subscribers signal
broadcast_room_no_me(ws, l);
send_to_clients=1;	
}else{}

if(send_to_clients==0){
ws.send(msg);	
}
})
ws.on('close',()=>{
console.log('ws closed')
})

function wsend(ob){
let a;
try{a=JSON.stringify(ob);}catch(e){retrun;}	
if(ws && ws.readyState==1)ws.send(a);
}
})

console.log(PORT)



