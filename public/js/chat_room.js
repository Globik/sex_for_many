var v=gid("video-wrapper");
var is_owner=gid('owner');
var yourNick=gid("yourNick");
var is_buser=gid("buser");
var isfake=gid("isfake");
var fakesrc=gid("fakesrc");
var modelName=gid("modelName");
var modelId=gid('modelId');
var chatTxt=gid('chatTxt');
var chat=gid("chat");
var chatcnt=gid("chatcnt");
var onlineDetector=gid("online-detector");
var underVideo=gid("under-video");
var btnStart=gid("btnStart");
var vasja=gid("vasja");
var btcc=gid("btcc");
var ONVAIR = false;
var is_vstream_started=false;
var is_first_time=false;
var is_dopPanel = false;
var dopPanel=gid("dopPanel");
//var mediaSource=new MediaSource();
//mediaSource.addEventListener('sourceopen',handleSourceOpen,false);
var mediaRecorder;
var recordedBlobs;
var sourceBuffer;
var vsrc = [];
var is_playing=false;
var current_playing=null;
var the_time;

var spanWhosOn = gid("spanWhosOn");
var sock;
var myusername;
var clientNick;

var localVideo=gid("localVideo");
var remoteVideo=gid("remoteVideo");
var localStream;
var targetusername;
var pc;
var dc;
var hasAddTrack=false;
var bon_ice;
var wstream=null;
var is_webcam = false;
//var vorlogincontainer=gid("vorlogincontainer");

var ice_server={"iceServers":[]};

var loc1=location.hostname+':'+location.port;
var loc2=location.hostname;
var loc3=loc1 || loc2;
var new_uri;

if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}

function insert_img(){
window.location.href="#insImg";
}	
function send_ws_img(){
var forImg=gid("forImg");
if(!forImg.value)return;
window.location.href="#.";
rem_hash();	
var d={};
d.type="msg";
d.msg = '<img src="'+forImg.value+'" height="80px"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
forImg.value="";
}

function owner(){return (is_owner.value==='true'?true:false);}
function buser(){return (is_buser.value==='true'?true:false);}
function fake(){return (isfake.value==='true'?true:false);}
function fake_src(){return fakesrc.value;}

//alert(fake());

function give_token(){
window.location.href="#vorlogery";
var dikStr=gid("vorlogincontainer").innerHTML=gid("loginStr").value;

}


open_socket();


function saveBTC(el){
if(!btcInput.value){return;}
let d={};
d.btc_client=btcInput.value;
d.username=modelName.value;
vax("post", "/api/savebtcaddress", d, on_saved_btc, on_save_btc_error, el,false);
el.classList.add("puls");
}
function on_saved_btc(d,el){
//alert('success '+JSON.stringify(d));
note({content: "Адрес сохранен!", type: "info", time: 5});
el.classList.remove("puls")
el.disabled=true;
}
function on_save_btc_error(l, el){
//console.error(l);	
el.classList.remove("puls");
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
chatcnt.textContent=0;
}
}
function sendi(ev){
if(ev.key==="Enter"){
send_up();
}
}
chatTxt.addEventListener('keydown', sendi, false);

function send_up(el){
if(!chatTxt.value)return;
let d={};
d.type = "msg";
d.msg = escape_html(chatTxt.value);
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);	
if(el)el.className="puls";
chatTxt.value="";
}
function insert_message(ob){
vasja.className="";
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-user">'+ob.from+': </span><span class="chat-message">'+ob.msg+'</span>';
m.innerHTML+='<div class="g-data">'+g_data(ob.tz)+'</div>';
chat.appendChild(m);
chat.scrollTop=chat.clientHeight+chat.scrollHeight;
}

function insert_notice(ob){
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-message">'+ob.msg+'</span>';
m.innerHTML+='<div class="g-data">'+g_data(ob.tz)+'</div>';
chat.appendChild(m);
chat.scrollTop=chat.clientHeight+chat.scrollHeight;
}
function escape_html(s){
var ix=s.replace(/[&<>"]/g,function(m){return '';})	
return ix;
}
function set_username(){
myusername=(owner()?modelName.value:(buser()?yourNick.value:clientNick));
wsend({type: "username", owner: owner(), name: myusername,roomname:modelName.value});
}

function on_msg(data){
try{
var ad=JSON.parse(data);
}catch(e){console.error(e);return;}
if(ad.type=="msg"){
	ad.tz=new Date();
insert_message(ad);	
}else if(ad.type=="nick"){
clientNick=ad.nick;
set_username();	
}else if(ad.type=="on_btc"){
btcc.textContent=ad.btc_all;
var obj7={};
obj7.from="Анон";
obj7.msg=" шлет "+ad.btc_amt+" сатоши";
obj7.tz=new Date();
insert_message(obj7);
}else if(ad.type=="count"){
	chatcnt.textContent=ad.user_count;
	if(fake())chatcnt.textContent=Math.floor(Math.random()*(100-10+1))+10;
}else if(ad.type=="owner_in"){
	//ad.tz=new Date();
	insert_notice({msg:'<b>'+ad.nick+'</b>&nbsp;вошел в чат.',tz:new Date()});
}else if(ad.type=="owner_out"){
	//ad.tz=new Date();
	insert_notice({msg:'<b>'+ad.nick+'</b>&nbsp;покинул чат.',tz:new Date()});
}else if(ad.type=="history"){
	ad.d.forEach(function(el,i){
	insert_message({from:el.nick,msg:el.msg,tz:el.tz});	
	})
}else if(ad.type=="no_target"){
// who(target),ontype(offer)
stop_failure(ad);//for non owner
}else if(ad.type=="offer"){
handle_offer(ad.offer,ad.from);	
}else if(ad.type=="answer"){
handle_answer(ad.answer);	
}else if(ad.type=="candidate"){
handle_candidate(ad.candidate);	
}else if(ad.type=="reject_call"){
note({content:ad.from+' отклонил звонок.', type:'error',time:5});
stopVideo();
}else if(ad.type=="spanWhosOn"){
if(spanWhosOn)spanWhosOn.textContent=ad.cnt;
vax("post", "/api/onesignal_count", {cnt: ad.cnt, desc:"chat room"}, function(){}, function(){}, null, false);
}else if(ad.type=="on_vair"){
vsrc.push(ad.vsrc);plad();
if(ad.is_first=="true"){
ONVAIR=true;
//alert(9);

if(!owner()){localVideo.style.display="none";v.className="";}
}
if(ad.is_active =="false"){
ONVAIR=false;	
//vsrc.push(ad.vsrc);plad();
if(!owner()){localVideo.style.display="block";v.className="notowner";}
}else{/*vsrc.push(ad.vsrc);plad();*/ONVAIR=true;}	
}else if(ad.type=="out_vair"){
ONVAIR=false;vsrc=[];
//console.log('VSRC: ',vsrc);
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

// WEBRTC STUFF
function do_start(el){
if(owner()){
	note({content:'Извините,\tвы не можете звонить себе.',type:'error',time:5});
return;	
}
el.disabled=true;
pc=createPeer();
go_webrtc();
}

 function go_webrtc(el){	
//audio:{echoCancellation:{exact:true}}
navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(function(stream){

if(!owner()){

localVideo.srcObject=stream;
localVideo.play();
localVideo.volume = 0;
stream.getTracks().forEach(function(track){pc.addTrack(track,stream)})
pc.createOffer().then(function(offer){
return pc.setLocalDescription(offer)}).then(function(){
wsend({type:'offer',offer:pc.localDescription, from:myusername,target:modelName.value});
	})
	
}else{
if(owner()){
//MediaRecorder
window.stream=stream;
localVideo.srcObject=stream;
is_video_transfer = true;
//el.className="active";
//is_webcam = true;
//vStreamStart.disabled=false;
//console.log('webcam is active');
}	
}	
	
	}).catch(function(err){
console.error(err);
//alert(er.name);
//note({content:'Подключите веб-камеру!',type:'error',time:5});
if(err.name=="NotFoundError"){
	note({content: "Включите веб-камеру.",type:"error",time:5});
}else{note({content:err.name,type:"error",time:5});}
if(!owner())btnStart.disabled=false;
webrtc.innerHTML+=err+'<br>';
if(owner())is_video_transfer=false;
})
}

function cancel_video(el){
stopVideo();	
}

function snapshot(){
if(is_webcam){
do_slepok();
return;	
}
navigator.mediaDevices.getUserMedia({video:true,audio:false}).then(function(stream){
localVideo.srcObject=stream;
setTimeout(do_slepok,1000);
}).catch(function(err){
console.error(err.name);
if(err.name=="NotFoundError"){
note({content: "Включите веб-камеру.",type:"error",time:5});
}else{note({content:err.name,type:"error",time:5});}
});

}
function do_slepok(b){
var cnv=document.createElement('canvas');
var w=80;var h=60;
cnv.width=w;cnv.height=h;
var c=cnv.getContext('2d');
c.drawImage(localVideo,0,0,w,h);
var img_data=cnv.toDataURL('image/png',1.0);
if(b){
return img_data;	
}else{
var d={};
d.type="msg";
d.msg = '<img src="'+img_data+'" height="80px" style="vertical-align:middle;"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
}
if(!is_webcam)stopVideo();
}
function get_slepok(){
	return do_slepok(true);
}
var suona=[{urls: [
"turn:bturn2.xirsys.com:80?transport=udp",
"turn:bturn2.xirsys.com:3478?transport=udp",
"turn:bturn2.xirsys.com:80?transport=tcp",
"turn:bturn2.xirsys.com:3478?transport=tcp",
"turns:bturn2.xirsys.com:443?transport=tcp",
"turns:bturn2.xirsys.com:5349?transport=tcp"
],
"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ==",
"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"},{urls:"stun:bturn2.xirsys.com"}];

var liushka;
try{liushka=JSON.parse(xirTarget.value);}catch(e){console.error("Xirsys ice servers not available");}
var bona=(xirTarget.value?[liushka]:null);
var donat=(bona?{"iceServers":bona}:null);
//const dona={iceServers:[bona]};
//const dona={iceServers: suona};
//const dona=bona;
console.warn("ICE SERVERS: ", donat);

//createPeer();
function createPeer(){
	//alert('peer');
pc=new RTCPeerConnection(donat);
pc.onicecandidate = on_ice_candidate;
pc.oniceconnectionstatechange = on_ice_connection_state_change;
pc.onicegatheringstatechange = on_ice_gathering_state_change;
pc.onicecandidaterror = on_ice_candidate_error;
pc.onnegotiationneeded = on_negotiation_needed;
pc.signalingstatechange = signaling_state_change;
pc.onconnectionstatechange = on_connection_state_change;
if(!owner()){
dc=pc.createDataChannel('globi');
dc.onopen=on_channel_state_change;
dc.onclose= on_channel_state_change;
dc.onmessage=on_receive_message;
}
pc.ondatachannel=receive_channel_cb;
pc.ontrack=on_track
return pc;	
}

function on_channel_state_change(){
var readyState = dc.readyState;
console.log('send channel state is: ', readyState);
if(readyState=="open"){
	on_display(false);
	}else{
		on_display(true);
		}	
}


function receive_channel_cb(event){
	dc=event.channel;
	dc.onmessage=on_receive_message;
	dc.onopen=on_channel_state_change;
	dc.onclose=on_channel_state_change;
}

function on_receive_message(event){
console.log('data channel: ', event.data);

var div=document.createElement("div");
try{
	msg_came();
	var a=JSON.parse(event.data);
div.innerHTML='<b>'+a.from+':</b> '+ a.msg;
}catch(e){return;}
privatchat.appendChild(div);
privatchat.scrollTop=privatchat.clientHeight+privatchat.scrollHeight;
}


function send_channel(obj){
if(dc){
	try{
dc.send(JSON.stringify(obj));	
}catch(e){}
}	
}

function on_display(bool){
	if(!bool){
		privatcontainer.classList.add("ondisplay");
		}else{
			privatcontainer.classList.remove("spanout");
			privatcontainer.classList.remove("ondisplay");
			
			privatpanel.classList.remove('msg-in');
			}
	}

var pflag=false;

function on_span(){
	//alert('spanout');
	if(!pflag){
	console.log(pflag);	
	privatcontainer.classList.add("spanout");
	privatpanel.classList.remove("msg-in");
	pflag=true;
}else{
	console.log(pflag);
privatcontainer.classList.remove("spanout");
pflag=false;	
}
}

function msg_came(){
if(!privatcontainer.classList.contains('spanout'))privatpanel.classList.add('msg-in');	
}

privatinput.addEventListener('keypress', dc_send, false);

function dc_send(ev){
if(ev.keyCode==13 || ev.which==13 || ev.key=="Enter"){
console.log(ev.target.value);
if(!ev.target.value)return;
var obj={};
obj.from=myusername;
obj.msg=ev.target.value;
send_channel(obj);
var div=document.createElement("div");
div.innerHTML='<b>'+myusername+':</b> '+ ev.target.value;
privatchat.appendChild(div);
privatchat.scrollTop=privatchat.clientHeight+privatchat.scrollHeight;
ev.target.value="";
}
}

function dopPanel_out(el){
if(!is_dopPanel){
is_dopPanel=true;
dopPanel.className="dopPanel_out";		
}else{
is_dopPanel=false;	
dopPanel.className="";
}
}

function start_webCamera(el){
	console.log('is_webcam: ',is_webcam);
if(!is_webcam){
go_webrtc(el);	
}else{
el.className = "";
is_webcam = false;
cancel_video(el);
vStreamStart.disabled=true;
}
}

function start_stream(el){
if(el.textContent=="Старт стрим"){
	//alert(1);
	//wsend({type:});
startRecording();
el.className="active";
is_vstream_started=true;
is_first_time=true;
the_time=new Date().getTime();
el.textContent="Стоп стрим";
v.className="";
webcamStart.className="";
webcamStart.disabled=true;
}else{
stopRecording();
is_vstream_started=false;
webcamStart.disabled=false;
webcamStart.className="active";
el.className="";

//wsend({type:"out_vair",
//is_first_time=false;
el.textContent="Старт стрим";
//wsend({type:"out_vair",);
if(owner()){v.className="owner";}else{}	

//localVideo.srcObject.getTracks().forEach(function(track){track.stop();})
}	
}
var kik=0;
var dik=0;
var tinterval;

var figa_timer=false;

function startRecording(){
if(figa_timer){figa_timer=false;}
recordedBlobs=[];
var opti={mimeType:'video/webm;codecs=vp9'};
if(!MediaRecorder.isTypeSupported(opti.mimeType)){
	console.error(opti.mimeType + ' is not supported');
	opti={mimeType:'video/webm;codecs=vp8'};
	if(!MediaRecorder.isTypeSupported(opti.mimeType)){
		console.error(opti.mimeType+' is not supported');
		opti={mimeType:'video/webm'};
		if(!MediaRecorder.isTypeSupported(opti.mimeType)){
			console.error(opti.mimeType+' is not supported');
			opti={mimeType:''};
			}
		}
	}
	try{
		mediaRecorder=new MediaRecorder(window.stream,opti);
		//is_vstream_started=true;
		}catch(e){
			console.error('mediarecorder err: ', e);
			is_vstream_started=false;
			is_first_time=false;
			vStreamStart.textContent="Стоп стрим";
			vStreamStart.className="";
v.className="";
webcamStart.className="active";
webcamStart.disabled=false;
			return;
			}
			//button stop recording
			
			mediaRecorder.onstart=function(){
				console.warn("On start");
				console.log('vsrc: ',vsrc)
				dik++;
				}
			mediaRecorder.onerror=function(){console.error('error');}
			mediaRecorder.onpause=function(ev){
				console.log('on pause',ev);
}
			mediaRecorder.onresume=function(){dik+=1;console.log('on resume');}
			
mediaRecorder.onstop=function(event){
console.warn('recorder stopped ', event);
console.log('recorded blobs: ', recordedBlobs);
console.log("kik: ",kik);
save_video_file();
}
mediaRecorder.ondataavailable=handlDataAvailable;
if(!figa_timer){
setTimeout(function(){
if(mediaRecorder.state=='inactive')return;
mediaRecorder.stop();
},10000);//60000
}
mediaRecorder.start();
console.warn('mediaRecorder started ');
}
function save_video_file(){
	//alert('dik:'+dik);
var file=new File(recordedBlobs, modelName.value+'_'+dik+'.webm',{type:mediaRecorder.mimeType});
var form_data=new FormData();
form_data.append('vn',file.name);
form_data.append('v',file);
form_data.append('room_id',modelId.value)
form_data.append('room_name', modelName.value);
form_data.append('is_active',is_vstream_started);
if(ifRecord.checked){
	//alert("RECORD!");
form_data.append('is_record',true);
form_data.append('recordArr',JSON.stringify({d:vsrc}));
}else{
form_data.append('is_record',false);	
}
form_data.append('is_first',is_first_time);
console.warn('vsrc: ',vsrc);
vax("post", "/api/save_video", form_data, on_save_video, on_save_video_error, null,true);
}

function on_save_video(l){
console.log(l);	
if(!figa_timer){
startRecording();
is_first_time=false;
}else{dik=0;is_first_time=false;}
//if(l.is_first=="true"){
var min_1=new Date().getTime();
var min_2=(min_1-the_time)/60000;
var min_3=Math.round(min_2);
var min_time;
var min_str;
if(min_3>=60){
	min_time=(min_3/60).toFixed(2);
	min_str='ч';
}else{
	min_time=(min_3==0?1:min_3);
	min_str='мин';
	}
var d={};
d.type="on_vair";
d.is_first=l.is_first;
d.is_active=l.is_active;
d.vsrc=l.vsrc;
d.src=(l.is_first=='true'?get_slepok():'');
d.room_id=l.room_id;
d.room_name=l.room_name;
d.min_time=min_time;
d.min_str=min_str;
d.v=chatcnt.textContent;
wsend(d);	
//}
if(l.is_active=="false"){
	//alert(2);
var d2={};
d2.type="out_vair";
d2.is_first=l.is_first;
d2.is_active=l.is_active;
d2.vsrc=l.vsrc;
d2.room_id=l.room_id;
d2.room_name=l.room_name;
wsend(d2);
}
}

function on_save_video_error(l){
console.error(l);	
}

function stopRecording(){
figa_timer=true;
if(mediaRecorder.state !="inactive")
mediaRecorder.stop();
is_vstream_started=false;
}

function handlDataAvailable(event){
console.warn("DATA AVAILABLE");	
if(event.data && event.data.size>0){
recordedBlobs.push(event.data);	
}
}
var q_n = 10;
function plad(){
if(!is_playing){
//if(current_playing==vsrc[vsrc.length-1]){console.warn("it looks like stream ends up");vsrc=[];return;}
console.log('vsrc: ', vsrc);
console.log('vsrc.length: ',vsrc.length);
console.log('vsrc[0]: ', vsrc[vsrc.length-1]);
do_play(vsrc[vsrc.length-1]);
if(owner()){
if(!ifRecord.checked){
if(vsrc.length > q_n){
var del_arr = vsrc.splice(0, vsrc.length - 3);
var del_arr_d = {};
del_arr_d.arr = del_arr;
del_arr_d.name = modelName.value;
vax("post", "/api/del_arr_video", del_arr_d, on_del_arr, on_del_arr_error, null, false);
}
}
}else{
if(vsrc.length > q_n){
vsrc.splice(0, vsrc.length - 3);	
}	
}
}
}
function on_del_arr(l){
console.log("ok - deleted some files - ", l.info);	
}
function on_del_arr_error(l){
console.error(l);	
}
function do_play(n){
if(owner()){
if(is_vstream_started==false){return;}
}else{
if(!ONVAIR)return;	
}
try{
console.log('N: ',n)
current_playing=n;
remoteVideo.src=n;
remoteVideo.play();	



}catch(er){console.log('err: ', er);}
}
remoteVideo.onplaying=function(){
is_playing=true;
console.log("it's playing");	
}
remoteVideo.onended=function(){
console.log('remote video ended');
is_playing=false;
if(ONVAIR)plad();
}

if(fake()){
remoteVideo.src='/vid/sveta.webm';
remoteVideo.play();
remoteVideo.muted=true;
remoteVideo.loop="loop";
v.className="";
//remoteVideo.controls=true;
tokencc.textContent=24;
conversation();
}
function popa(){
remoteVideo.muted=false;	
}



function conversation(){
let ab=["давай, давай!","ух ты", "писька пиздатая", "ну и сиськи", "задница зашибись", "ну и попка", "молодец!","так держать", "ну и ну"];
let names=["Nicky","Sveta","lettali","haylix","xaevynne","sexyru_couple","miss_julia","sasha","kaileeshy","wowgirls","john","mik","dura"];

let a=Math.floor(Math.random()*(ab.length-1));
let b=ab[a];
let c=Math.floor(Math.random()*(names.length-1));
let d=names[c];
insert_message({from:d,msg:b,tz:new Date()});
setTimeout(conversation,60000);
dummi_token();
}
function dummi_token(){
var nameD=["Nicky","Sveta","lettali","haylix","xaevynne","sexyru_couple","miss_julia","sasha","kaileeshy","wowgirls","john","mik","dura"];
let c=Math.floor(Math.random()*(nameD.length-1));
let d=nameD[c];
insert_message({from: d, msg: "шлет на чай один токен.", tz: new Date()});
insert_message({from: modelName.value, msg: "Спасибо, "+d+"!", tz: new Date()});
tokencc.textContent=Number(tokencc.textContent)+1;

setTimeout(dummi_token,58000);	
}
function del_video(el){
var a=el.getAttribute('data-bid');
var e=el.getAttribute('data-src');
if(!a || !e)return;
if(confirm("Удалить видео?")){
var d={};
d.vid=a;
d.src=e;
vax("post", "/api/video_deleteUs", d, on_video_del, on_video_del_error, el, false);
el.className="puls";
}
}

function on_video_del(l,ev){
ev.className="";
note({content:l.info,type:"info",time:5});	
var s=document.querySelector('[data-id="'+ev.getAttribute('data-bid')+'"]');
if(s)s.remove();
}
function on_video_del_error(l,ev){
ev.className="";
note({content:l,type:"error",time:5});	
}
function vplay(el){
var a=el.getAttribute('data-vid');
if(!a)return;
var d={};
d.vid=a;
vax("post", "/api/video_views", d, on_video_views, on_video_views_error, null, false);
}
function on_video_views(l){
console.log(l);	
}
function on_video_views_error(l){console.error(l);}

function handleSourceOpen(){}

function on_track(event){
	//if(!event.streams[0])
	remoteVideo.srcObject=event.streams[0];
	//remoteVideo.play();
//remoteVideo.volume = 0;
}
function on_ice_candidate(event){
if(event.candidate){
console.warn("ON ICE CANDIDATE!");
var d={};
d.type="candidate";
d.candidate=event.candidate;
//alert(myusername);
d.from=myusername;
d.target=modelName.value;
wsend(d);	
}	
}
function handle_candidate(cand){
if(pc)pc.addIceCandidate(cand)	
}
function on_ice_connection_state_change(){
console.log('ice connection state: ',this.iceConnectionState);
//disconnected failed connected completed
//TODO if 'checking' very long - mark as failed in owner space
if(this.iceConnectionState=="disconnected"){
underVideo.className="";
stopVideo();
//if(is_owner()){v.className="";}else{v.className="owner-offline";v.poster="";}
}else if(this.iceConnectionState=="closed"){
if(owner()){
v.className="";
stopVideo();
}

//if(!is_owner()){
//btnStart.textContent='start';
//}
}else if(this.iceConnectionState=="connected"){
v.className="start";
}else if(this.iceConnectionState=="completed"){
//onlineDetector.className="puls";// any need?
v.className="start";
}else{}	
}
function on_ice_gathering_state_change(){console.log("ice gathering: ",this.iceGatheringState);
}
function on_ice_candidate_error(err){console.error('ice candidate err: ', err);}
 function on_negotiation_needed(){
	console.warn("ON NEGOTIATION NEEDED!");
	
	}
	
function signaling_state_change(){console.log('signaling state: ',this.signalingState);}
function on_connection_state_change(){
console.log('connection state: ', this.connectionState);
if(this.connectionState=="disconnected"){
//stop_stream();
//pc.close();
stopVideo();
}else if(this.connectionState=="failed"){
	stopVideo();
}else if(this.connectionState=="connecting"){
setTimeout(function(){
	//stopVideo();
//stop_stream();pc.close();pc=null;pubId=0;btnStart.textContent="start";
},10000);
v.className="connecting";
}
}

//async 
function handle_offer(sdp, target){
	/*
	try{
	pc=createPeer();
	await pc.setRemoteDescription(sdp);
	//var Bstream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
	var su= await navigator.mediaDevices.getUserMedia({video:true, audio:true});
	localVideo.srcObject=su;
	console.log(1)
	su.getTracks().forEach(function(t){pc.addTrack(t,su)})
	console.log(2);
await pc.setLocalDescription(await pc.createAnswer());
wsend({type:"answer","answer":pc.localDescription,"from":myusername,"target":target});
}catch(e){console.error(e);}
*/

	
		console.log('in han off: ',sdp);
		var r=confirm("Видеозвонок от "+target+". Принять звонок?");
		
		if(!r){
			wsend({type:"reject_call",target:target,from:myusername});
			stopVideo();
			return;
			}
			if(pc){wsend({type:"reject_call",target:target,from:myusername});return;}
pc=createPeer();

 pc.setRemoteDescription(sdp).then(function(){

return navigator.mediaDevices.getUserMedia({video:true,audio:true})}).then(function(stream){
localVideo.srcObject=stream;

stream.getTracks().forEach(function(track){pc.addTrack(track, stream)})

}).then(function(){
	return pc.createAnswer();
}).then(function(answer){
return pc.setLocalDescription(answer);	
}).then(function(){
wsend({type:"answer","answer":pc.localDescription,"from":myusername,"target":target});


}).catch(function(e){
console.log(e);
webrtc.innerHTML+=e+'<br>';		
})


}


function handle_answer(sdp){
console.log("answer came");

pc.setRemoteDescription(sdp);	
}

function stop_failure(obj){
//for non owner?

stopVideo();	
note({content:'Извините,\t'+obj.who+'\tоффлайн.',type:'error',time:5});
}

function stopVideo(){
	console.log('stop video');
if(remoteVideo.srcObject){
remoteVideo.srcObject.getTracks().forEach(function(track){track.stop();})
}
if(localVideo.srcObject){
localVideo.srcObject.getTracks().forEach(function(track){track.stop();})
}

if(!pc){console.log('no pc');return;}
clearPeer();
}
function clearPeer(){
console.log('pc: ',pc.signalingState);
pc.close();
pc.onicecandidate=null;
//pc.onaddstream=null;
//pc.onremovestream=null;

pc.oniceconnectionstatechange = null;
pc.onicegatheringstatechange = null;
pc.onicecandidaterror = null;
pc.onnegotiationneeded = null;
pc.signalingstatechange = null;
pc.onconnectionstatechange=null;
pc.on_track=null;
pc=null;
console.log('pc: ',pc);
if(owner()){
v.className="owner";
}else{
	v.className="notowner"
	}
btnStart.disabled=false;
}

//profile
function get_profile(){
	//alert(modelName.value);
	if(!modelName.value)return;
vax("post", "/api/get_p", {name:modelName.value}, on_get_profile, on_get_profile_error, null,false);
}
setTimeout(function(){
	console.log("time");
	get_profile()},1)

function on_get_profile(l){
//alert(1);
	console.log(l);
	//id | bname | age |   msg    | ava | isava 
	if(l.info=="ok"){
		clientName.textContent=l.params.bname;
		clientCity.textContent=l.params.city;
		clientOrientation.textContent=l.params.bi;
		clientAge.textContent=l.params.age;
		clientMsg.textContent=l.params.msg;
		clientViews.textContent=l.params.vs;
		var d=document.createElement('img');
		d.height="150";
		//alert(l.params.ava);
		if(l.params.ava){
		d.src=l.params.ava;
			}else{
				d.src='/images/default.jpg';
				}
				clientFoto.appendChild(d);
	}
}

setTimeout(function(){set_vs()},3000);

function set_vs(){
if(owner())return;
var d34={};
d34.name=modelName.value;
vax("post", "/api/set_views", d34, on_set_vs, on_get_profile_error, null,false);
}
function on_set_vs(l){console.log(l);}

function on_get_profile_error(l){console.error(l);}
localVideo.onloadedmetadata=function(e){
	console.log('on local video loaded video data');
	if(owner()){
		webcamStart.className="active";
		is_webcam = true;
		vStreamStart.disabled=false;
	}
	}
localVideo.onerror=function(e){console.error('err: ',e);}
remoteVideo.onerror=function(e){console.error('err: ', e);}
remoteVideo.onloadedmetadata=function(e){console.log('on remote video loaded video data');}
