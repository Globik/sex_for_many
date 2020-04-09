var sock=null;
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

function get_socket(){
sock=new WebSocket(new_uri+'//'+loc3+'/gesamt');

sock.onopen=function(){
console.log("websocket opened");
}
sock.onerror=function(e){console.error("websocket error",e);}
sock.onmessage=function(evt){
console.log("message", evt.data);
on_msg(evt.data)
}
sock.onclose=function(){
console.log("Websocket closed");
}
}
get_socket();
function on_msg(d){
try{
var ajson=JSON.parse(d);	
}catch(e){return;}
if(ajson.type=="new_room"){
var s5=gid("zagln");
if(s5)s5.remove();
var dimg=document.createElement("div");
dimg.setAttribute('data-roomid',ajson.us_id);
dimg.className="img-online-container";
dimg.innerHTML='<img class="img-online" src="'+(ajson.ava?(ajson.isava==2?ajson.ava:'/images/default.jpg'):'/images/default.jpg')+'">'+
'<footer class="img-footer"><a href="/webrtc/'+ajson.us_id+'">'+ajson.nick+'</a>&nbsp;,&nbsp;'+(ajson.age?ajson.age:'18')+' лет.'+
'&nbsp;(<span data-vid="'+ajson.us_id+'">'+ajson.v+'</span>&nbsp;чел.)</footer>';
gid('onlineContainer').appendChild(dimg);
}else if(ajson.type=="out_room"){
var seli=document.querySelector('[data-roomid="'+ajson.roomid+'"]');
try{	
if(seli){
seli.remove();
var s7=document.querySelector(".img-online-container");
if(!s7){
//alert("nobody");
var buserli=gid("buserli");
var suserli=(buserli.value=="0"?false:true);
var su=(suserli?'/webrtc/'+buserli.value:'/login');
var s8=document.createElement("span");
//<span id="zagln">Пока нет никого.</span>
s8.id="zagln";
s8.innerHTML='Пока нет никого. <a class="ahero" href="'+su+'">Будь первым!</a>';
gid('onlineContainer').appendChild(s8);
}
}
}catch(e){}
}else if(ajson.type=="room_part"){
var s9=document.querySelector('[data-vid="'+ajson.roomid+'"]');
if(s9)s9.textContent=ajson.part;
}else{console.log("unknown type: ", ajson.type);}
}
