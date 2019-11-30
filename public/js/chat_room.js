var v=gid("video-wrapper");
var is_owner=gid('owner');
var yourNick=gid("yourNick");
var is_buser=gid("buser");
var modelName=gid("modelName");
var modelId=gid('modelId');
var chatTxt=gid('chatTxt');
var chat=gid("chat");
var chatcnt=gid("chatcnt");
var onlineDetector=gid("online-detector");
var underVideo=gid("under-video");
var btnStart=gid("btnStart");
var sock;
var myusername;
var clientNick;

var loc1=location.hostname+':'+location.port;
//var loc2='frozen-atoll-47887.herokuapp.com';
var loc2=location.hostname;
var loc3=loc1 || loc2;
var new_uri;

if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}

function owner(){return (is_owner.value==='true'?true:false);}
function buser(){return (is_buser.value==='true'?true:false);}

open_socket();


function saveBTC(el){
if(!btcInput.value){alert("Please give correct btc adress");return;}
let d={};
d.btc_client=btcInput.value;
d.username=modelName.value;

vax("post", "/api/savebtcaddress", d, on_saved_btc, on_save_btc_error, el,false);
}
function on_saved_btc(d){
alert('success '+d);
el.disabled=true;
}
function on_save_btc_error(l){
console.error(l);	
let span=crel("span","\t"+l,"red");
insert_after(span, bInput,"span");
}
function reset_btc(){
btcInput.value="";
del_after(bInput,"span");
btnSaveAdr.disabled=false;	
}

function open_socket(){
if(sock){console.log("already in connection");return;}

sock=new WebSocket(new_uri+'//'+loc3+'/'+modelId.value);
//sock=new WebSocket(new_uri+'//'+loc3+'/'+usname);

sock.onopen=function(){
	//alert(loc3);
console.log("websocket opened")
}
sock.onerror=function(e){
console.log("websocket error ", e);
}
sock.onmessage=function(evt){
console.log("message", evt.data);
on_msg(evt.data)
}
sock.onclose=function(){
console.log("Websocket closed");
}
}
function sendi(ev){
if(ev.key==="Enter"){
send_up();
}
}
chatTxt.addEventListener('keydown',sendi,false);

function send_up(){
if(!chatTxt.value)return;
let d={};
d.type = "msg";
d.msg = escape_html(chatTxt.value);
d.to = modelId.value;
d.from = myusername;// yourNick.value;
wsend(d);	
chatTxt.value="";
}
function insert_message(ob){
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-user">'+ob.from+' :&nbsp;</span>&nbsp;<span class="chat-message">'+ob.msg+'</span>';
chat.appendChild(m);
chat.scrollTop=chat.clientHeight;
}
function escape_html(s){
var ix=s.replace(/[&<>"]/g,function(m){return '';})	
return ix;
}
function set_username(){
/*	
if(owner()){myusername=modelName.value;}else{
if(buser()){myusername=yourNick.value}else{myusername=clientNick;}	
}*/
myusername=(owner()?modelName.value:(buser()?yourNick.value:clientNick));
wsend({type: "username", owner: owner(), name: myusername});
}

function on_msg(data){
try{
var ad=JSON.parse(data);
}catch(e){console.error(e);return;}
if(ad.type=="msg"){
insert_message(ad);	
}else if(ad.type=="nick"){
clientNick=ad.nick;
chatcnt.textContent=ad.user_count;
set_username();	
}else{
console.log('unknown type: '+ad.type);	
}

}
function wsend(obj){
if(!sock)return;
try{
sock.send(JSON.stringify(obj));	
}catch(e){}	
}
