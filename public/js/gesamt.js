var sock = null;
var spanWhosOn = gid("spanWhosOn");
var loc1 = location.hostname+':'+location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;
var yourLang = gid('yourLang');

if(window.location.protocol === "https:"){
new_uri = 'wss:';
}else{
new_uri = 'ws:';
}

function get_socket(){
sock=new WebSocket(new_uri + '//' + loc3 + '/gesamt');

sock.onopen = function(){
console.log("websocket opened");
}
sock.onerror = function(e){console.error("websocket error",e);}
sock.onmessage = function(evt){
console.log("message", evt.data);
on_msg(evt.data)
}
sock.onclose = function(){
console.log("Websocket closed");
}
}
get_socket();
function on_msg(d){
try{
var ajson = JSON.parse(d);	
}catch(e){return;}
if(ajson.type == "new_room"){
var s6 = gid("zagln2");
if(s6)s6.remove();

console.log('ajson: ',ajson);
var dimi = document.createElement("div");

dimi.setAttribute('data-roomidi', ajson.room_id);
dimi.className = "vroomers";
dimi.innerHTML = '<a href="/webrtc/' + ajson.room_id + '"><header>' + ajson.room_name + '</header></a><p itemprop="description">' + (ajson.descr?(ajson.descr).substring(0, 52) : "I\'m online : )") + '</p>';
dimi.innerHTML+= '<a href="/webtc/' + ajson.room_id + '"><img class="videovroomers" data-avid="' + ajson.room_id + '" onerror="foto_error(this);"  src="' + (ajson.src?ajson.src:'/images/unnamed.jpg') + '"' + ' data-vidi="' + ajson.room_id + '">';
dimi.innerHTML+= '<header class="untervideo"><span class="timecl" data-min_time="' + ajson.room_id + '">' + (ajson.min_time ? ajson.min_time: '') + '</span>&nbsp;<span class="timecl" data-min_str="' + ajson.room_id+'">' + (ajson.min_str ? ajson.min_str: '') + '</span>' + (ajson.minstr ? ',': '') + '&nbsp;<span class="timecl" data-v_str="' + ajson.room_id + '">' + ajson.v + '</span>&nbsp;<span class="timecl">зрителей</span></header>';
videoContainer.appendChild(dimi);
}else if(ajson.type == "out_room"){

}else if(ajson.type == "room_part"){
var s9 = document.querySelector('[data-min_time="' + ajson.roomid + '"]');
if(s9)s9.textContent = ajson.min_t;
var s10 = document.querySelector('[data-min_str="' + ajson.roomid + '"]');
if(s10)s10.textContent = ajson.min_s;
var s11 = document.querySelector('[data-v_str="' + ajson.roomid + '"]');
if(s11)s11.textContent = ajson.part;
}else if(ajson.type == "spanWhosOn"){
if(spanWhosOn){
spanWhosOn.textContent = ajson.cnt;	
}
vax("post", "/api/onesignal_count", 
{cnt: ajson.cnt, desc: "main page"}, function(l){console.log(l)}, function(l){console.error(l)}, null, false);
}else if(ajson.type == "on_vair"){
if(ajson.is_first == 'true'){
if(ajson.is_active == 'false')return;
}
console.log('ajson: ', ajson);
var baba = document.querySelector('[data-roomidi="' + ajson.room_id + '"]');
if(baba){
var ss = document.createElement("div");
ss.setAttribute('data-indicator', ajson.room_id);
ss.className = "indicator red";
baba.appendChild(ss);
var baba2 = document.querySelector('[data-vidi="' + ajson.room_id + '"]');
if(baba2){
baba2.src = ajson.src;	
}
var baba3 = document.querySelector('[data-v_str="' + ajson.room_id + '"]');
if(baba3){
baba3.textContent = ajson.v;	
}
}
function get_min(){
	return Math.floor(Math.random() * (60 - 10 + 1)) + 10;
}
}else if(ajson.type == "out_vair"){
var we = document.querySelector('[data-roomidi="' + ajson.room_id + '"]');

 try{
if(we)we.remove();
var s7 = document.querySelector(".vroomers");
if(!s7){
var buserli = gid("buserli");
var suserli = (buserli.value=="0"?false:true);
var su = (suserli ? '/webrtc/' + buserli.value: '/login');
var s8 = document.createElement("span");
s8.id = "zagln2";
let s = (yourLang.value == 'ru'?'Пока нет никого. <a class="ahero" href="'+su+'">Будь первым!</a>':'Nobody yet. <a class="ahero" href="'+su+'">Be the first one!</a>');
s8.innerHTML = s;
gid('videoContainer').appendChild(s8);
}}catch(e){console.log(e)} 
}else if(ajson.type == "out_vair2"){
var we2 = document.querySelector('[data-roomidi="' + ajson.room_id + '"]');
var we3 = document.querySelector('[data-indicator="' + ajson.room_id + '"]');
if(we3){we3.remove();}
var baba4 = document.querySelector('[data-vidi="' + ajson.room_id + '"]');
if(baba4){
baba4.src = (ajson.src ? ajson.src: "/images/unnamed.jpg");	
}
}else if(ajson.type == "privat"){
var baba6 = document.querySelector('[data-roomidi="' + ajson.id + '"]');
if(baba6){
var ss2 = document.createElement("div");
ss2.setAttribute('data-indicator', ajson.id);
ss2.className = "indicator green";
baba6.appendChild(ss2);
}
	}else if(ajson.type == "unprivat"){
var we5 = document.querySelector('[data-indicator="' + ajson.id + '"]');
if(we5){we5.remove();}
		}else if(ajson.type == "new_ava"){
var baba5 = document.querySelector('[data-vidi="' + ajson.id + '"]');
if(baba5){
baba5.src = ajson.avasrc;
}
}else{console.log("unknown type: ", ajson.type);}
}

function vplay(el){
var a = el.getAttribute('data-video_id');
if(!a)return;
let d = {};
d.vid=a;
vax("post", "/api/video_views", d, on_video_views, on_video_views_error, null, false);
}
function on_video_views(l){
console.log(l);	
}
function on_video_views_error(l){console.error(l);}

function foto_error(el){
var avid = el.getAttribute('data-avid');
if(!avid)return;
let d={};
d.avid = avid;
d.src = el.src;
//vax("post", "/api/foto_error", d, on_foto_error, on_foto_error_err, el, false);
}
function on_foto_error(l,ev){}
function on_foto_error_err(l,ev){}
