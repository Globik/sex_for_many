var sock=null;
var spanWhosOn=gid("spanWhosOn");
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
	/*
var s5=gid("zagln");
if(s5)s5.remove();
var selid=document.querySelector('[data-roomid="'+ajson.us_id+'"]');
try{	
if(selid){
	//alert(selid);
selid.remove();
}
}catch(e){}


var dimg=document.createElement("div");
dimg.setAttribute('data-roomid',ajson.us_id);
dimg.className="img-online-container";
dimg.innerHTML='<img class="img-online" src="'+(ajson.ava?ajson.ava:'/images/default.jpg')+'">';
dimg.innerHTML+='<div class="img-footer"><a href="/webrtc/'+ajson.us_id+'">'+ajson.nick+'</a> , '+(ajson.age?ajson.age:'18')+' лет.'
dimg.innerHTML+='(<span data-vid="'+ajson.us_id+'">'+ajson.v+'</span> чел.)</div>';
gid('onlineContainer').appendChild(dimg);
var ch=window.getComputedStyle(gid('onlineContainer'),null).getPropertyValue('height');
console.log("HEIGHT: ",ch);
var h=window.getComputedStyle(gid('onlineSection'),null).getPropertyValue('height');
console.log('h: ',h)
onlineSection.style.height=h;
console.log(h+ch);
*/ 
}else if(ajson.type=="out_room"){
/*
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

s8.id="zagln";
s8.innerHTML='Пока нет никого. <a class="ahero" href="'+su+'">Будь первым!</a>';
gid('onlineContainer').appendChild(s8);
}
}
}catch(e){}
*/ 
}else if(ajson.type=="room_part"){
var s9=document.querySelector('[data-vid="'+ajson.roomid+'"]');
if(s9)s9.textContent=ajson.part;
}else if(ajson.type=="spanWhosOn"){
if(spanWhosOn){
spanWhosOn.textContent=ajson.cnt;	
}
vax("post", "/api/onesignal_count", 
{cnt: ajson.cnt, desc: "main page"}, function(l){console.log(l)}, function(l){console.error(l)}, null, false);
}else if(ajson.type=="on_vair"){
	//alert(440);
if(ajson.is_first=='true'){
if(ajson.is_active=='false')return;
}
var s6=gid("zagln2");
if(s6)s6.remove();
//var we=document.querySelector('[data-roomidi="'+ajson.us_id+'"]')
//try{
//if(we)we.remove();}catch(e){}
console.log('ajson: ',ajson);
var dimi=document.createElement("div");
dimi.setAttribute('data-roomidi',ajson.room_id);
dimi.className="vroomers";
dimi.innerHTML='<header><a href="/webrtc/'+ajson.us_id+'"><span>'+ajson.room_name+'</span></a></header>';
dimi.innerHTML+='<a href="/webtc/'+ajson.us_id+'"><video class="videovroomers"  poster="'+ajson.src+'"'+' data-vidi="'+ajson.room_id+'"></video></a>';
dimi.innerHTML+='<header class="untervideo"><span class="timecl" id="ptime">'+get_min()+'</span>&nbsp;<span class="timecl">мин</span>,&nbsp;<span class="timecl" id="vtime">'+3+'</span>&nbsp;<span class="timecl">зрителей</span></header>';
videoContainer.appendChild(dimi);
function get_min(){
	return Math.floor(Math.random()*(60-10+1))+10;
}
}else if(ajson.type=="out_vair"){
	//alert(1);
var we=document.querySelector('[data-roomidi="'+ajson.room_id+'"]')
try{
if(we)we.remove();
var s7=document.querySelector(".vroomers");
if(!s7){
var buserli=gid("buserli");
var suserli=(buserli.value=="0"?false:true);
var su=(suserli?'/webrtc/'+buserli.value:'/login');
var s8=document.createElement("span");
s8.id="zagln2";
s8.innerHTML='Пока нет никого. <a class="ahero" href="'+su+'">Будь первым!</a>';
gid('videoContainer').appendChild(s8);
}}catch(e){console.log(e)}
}else{console.log("unknown type: ", ajson.type);}
}

function vplay(el){
var a=el.getAttribute('data-video_id');
if(!a)return;
var d={};
d.vid=a;
vax("post", "/api/video_views", d, on_video_views, on_video_views_error, null, false);
}
function on_video_views(l){
console.log(l);	
}
function on_video_views_error(l){console.error(l);}
