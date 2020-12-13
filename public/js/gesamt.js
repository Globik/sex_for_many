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

var s6=gid("zagln2");
if(s6)s6.remove();

console.log('ajson: ',ajson);
var dimi=document.createElement("div");

dimi.setAttribute('data-roomidi',ajson.room_id);
dimi.className="vroomers";
dimi.innerHTML='<a href="/webrtc/'+ajson.room_id+'"><header>'+ajson.room_name+'</header></a><p itemprop="description">'+(ajson.descr?(ajson.descr).substring(0,52):"I\'m online : )")+'</p>';
dimi.innerHTML+='<a href="/webtc/'+ajson.room_id+'"><img class="videovroomers" data-avid="'+ajson.room_id+'" onerror="foto_error(this);"  src="'+(ajson.src?ajson.src:'/images/unnamed.jpg')+'"'+' data-vidi="'+ajson.room_id+'">';
dimi.innerHTML+='<header class="untervideo"><span class="timecl" data-min_time="'+ajson.room_id+'">'+(ajson.min_time?ajson.min_time:'')+'</span>&nbsp;<span class="timecl" data-min_str="'+ajson.room_id+'">'+(ajson.min_str?ajson.min_str:'')+'</span>'+(ajson.minstr?',':'')+'&nbsp;<span class="timecl" data-v_str="'+ajson.room_id+'">'+ajson.v+'</span>&nbsp;<span class="timecl">зрителей</span></header>';
videoContainer.appendChild(dimi);









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
var s9=document.querySelector('[data-min_time="'+ajson.roomid+'"]');
if(s9)s9.textContent=ajson.min_t;
var s10=document.querySelector('[data-min_str="'+ajson.roomid+'"]');
if(s10)s10.textContent=ajson.min_s;
var s11=document.querySelector('[data-v_str="'+ajson.roomid+'"]');
if(s11)s11.textContent=ajson.part;
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
//var s6=gid("zagln2");
//if(s6)s6.remove();


//var we=document.querySelector('[data-roomidi="'+ajson.us_id+'"]')
//try{
//if(we)we.remove();}catch(e){}
console.log('ajson: ',ajson);
//var dimi=document.createElement("div");
/* <div data-roomidi="${el.us_id}" class="vroomers" itemscop itemtype="http://schema.org/VideoObject">
<a href="/webrtc/${el.us_id}" itemprop="url">
<header itemprop="name">${el.nick}</header></a>
<p itemprop="description">${el.descr}</p>
<meta itemprop="duration" content="PT6M58S">
<meta itemprop="isFamilyFriendly" content="false">
<span itemprop="uploadDate">2020-06-05T00:00:00</span><br>
<span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject">
<img itemprop="contentUrl" class="videovroomers" src="${el.typ=='fake'?'/vid/'+el.p:el.p}" data-vidi="${el.us_id}">
<meta itemprop="width" content="250">
<meta itemprop="height" content="120"></span>
<header class="untervideo"><span class="timecl" data-min_time="${el.us_id}">${el.typ=='fake'?get_min():get_mini(el.crat).t}</span>&nbsp;<span class="timecl" data-min_str="${el.us_id}">${el.typ=='fake'?'мин':get_mini(el.crat).s}</span>,&nbsp;
<span class="timecl" data-v_str="${el.us_id}">${el.typ=='fake'?gruss():el.v}</span>&nbsp;<span class="timecl">зрителей</span></header>
</div> */

/*
dimi.setAttribute('data-roomidi',ajson.room_id);
dimi.className="vroomers";
dimi.innerHTML='<a href="/webrtc/'+ajson.room_id+'">
<header>'+ajson.room_name+'</header></a><p itemprop="description">'+(ajson.descr?(ajson.descr).substring(0,52):"")+'</p>';
dimi.innerHTML+='<a href="/webtc/'+ajson.room_id+'">
<img class="videovroomers"  src="'+ajson.src+'"'+' data-vidi="'+ajson.room_id+'">';
dimi.innerHTML+='<header class="untervideo">
<span class="timecl" data-min_time="'+ajson.room_id+'">'+ajson.min_time+'</span>&nbsp;
<span class="timecl" data-min_str="'+ajson.room_id+'">'+ajson.min_str+'</span>,&nbsp;
<span class="timecl" data-v_str="'+ajson.room_id+'">'+ajson.v+'</span>&nbsp;<span class="timecl">зрителей</span></header>';
videoContainer.appendChild(dimi);
*/ 
var baba=document.querySelector('[data-roomidi="'+ajson.room_id+'"]');
if(baba){
var ss=document.createElement("div");
ss.setAttribute('data-indicator',ajson.room_id);
ss.className="indicator red";
baba.appendChild(ss);
var baba2=document.querySelector('[data-vidi="'+ajson.room_id+'"]');
if(baba2){
baba2.src=ajson.src;	
}
var baba3=document.querySelector('[data-v_str="'+ajson.room_id+'"]');
if(baba3){
baba3.textContent=ajson.v;	
}
}
function get_min(){
	return Math.floor(Math.random()*(60-10+1))+10;
}
}else if(ajson.type=="out_vair"){
	//alert(1);
var we=document.querySelector('[data-roomidi="'+ajson.room_id+'"]');
/*if(we){
	var baba4=document.querySelector('[data-vidi="'+ajson.room_id+'"]');
if(baba4){
baba4.src=ajson.src;	
}
}*/
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
}else if(ajson.type=="out_vair2"){
var we2=document.querySelector('[data-roomidi="'+ajson.room_id+'"]');
var we3=document.querySelector('[data-indicator="'+ajson.room_id+'"]');
if(we3){we3.remove();}
var baba4=document.querySelector('[data-vidi="'+ajson.room_id+'"]');
if(baba4){
baba4.src=(ajson.src?ajson.src:"/images/unnamed.jpg");	
}
}else if(ajson.type=="privat"){
var baba6=document.querySelector('[data-roomidi="'+ajson.id+'"]');
if(baba6){
var ss2=document.createElement("div");
ss2.setAttribute('data-indicator',ajson.id);
ss2.className="indicator green";
baba6.appendChild(ss2);
	}else if(ajson.type=="unprivat"){
var we5=document.querySelector('[data-indicator="'+ajson.id+'"]');
if(we5){we5.remove();}
		}else if(ajson.type=="new_ava"){
var baba5=document.querySelector('[data-vidi="'+ajson.id+'"]');
if(baba5){
baba5.src=ajson.avasrc;
}
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

function foto_error(el){
var avid=el.getAttribute('data-avid');
if(!avid)return;
var d={};
d.avid=avid;
vax("post", "/api/foto_error", d, on_foto_error, on_foto_error_err, el, false);
}
function on_foto_error(l,ev){}
function on_foto_error_err(l,ev){}
