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
var btcc=gid("btcc");
var sock;
var myusername;
var clientNick;

var localVideo=gid("localVideo");
var remoteVideo=gid("remoteVideo");
var localStream;
var targetusername;
var pc;
var hasAddTrack=false;
var bon_ice;
var wstream=null;

//navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
var ice_server={"iceServers":[]};

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
d.msg = '<img src="'+forImg.value+'" height="80px" style="vertical-align:middle;"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
forImg.value="";
}

function owner(){return (is_owner.value==='true'?true:false);}
function buser(){return (is_buser.value==='true'?true:false);}

open_socket();


function saveBTC(el){
if(!btcInput.value){return;}
let d={};
d.btc_client=btcInput.value;
d.username=modelName.value;

vax("post", "/api/savebtcaddress", d, on_saved_btc, on_save_btc_error, el,false);
}
function on_saved_btc(d,el){
alert('success '+JSON.stringify(d));
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

function send_up(){
if(!chatTxt.value)return;
let d={};
d.type = "msg";
d.msg = escape_html(chatTxt.value);
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);	
chatTxt.value="";
}
function insert_message(ob){
	console.log('insert_message');
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-user">'+ob.from+':&nbsp;</span><span class="chat-message">'+ob.msg+'</span>';
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

 function go_webrtc(){	

navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(async function(stream){
localVideo.srcObject=stream;
localVideo.play();
localVideo.volume = 0;
stream.getTracks().forEach(function(track){pc.addTrack(track,stream)})

try{
	await pc.setLocalDescription(await pc.createOffer());
	//alert('musn '+myusername+'modname'+modelName.value);
	wsend({type:'offer',offer:pc.localDescription, from:myusername,target:modelName.value});
	}catch(e){
	console.error(e);
		webrtc.innerHTML+=e+'<br>';
		}

}).catch(function(er){
console.error(er);
note({content:'Подключите веб-камеру!',type:'error',time:5});
if(!owner())btnStart.disabled=false;
webrtc.innerHTML+=er+'<br>';})
}

function cancel_video(el){
stopVideo();	
}

function snapshot(){
navigator.mediaDevices.getUserMedia({video:true,audio:false}).then(async function(stream){
localVideo.srcObject=stream;
setTimeout(function(){
var cnv=document.createElement('canvas');
var w=80;var h=60;
cnv.width=w;cnv.height=h;
var c=cnv.getContext('2d');
c.drawImage(localVideo,0,0,w,h);
var img_data=cnv.toDataURL('image/png',1.0);
var d={};
d.type="msg";
d.msg = '<img src="'+img_data+'" height="80px" style="vertical-align:middle;"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
stopVideo();
},1000);
}).catch(function(err){
	console.error(err.name);
	if(err.name=="NotFoundError"){
	note({content: "Включите веб-камеру.",type:"error",time:5});
}else{note({content:err.name,type:"error",time:5});}
});

}

var bona=[{urls: [
"turn:bturn2.xirsys.com:80?transport=udp",
"turn:bturn2.xirsys.com:3478?transport=udp",
"turn:bturn2.xirsys.com:80?transport=tcp",
"turn:bturn2.xirsys.com:3478?transport=tcp",
"turns:bturn2.xirsys.com:443?transport=tcp",
"turns:bturn2.xirsys.com:5349?transport=tcp"
],
"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ==",
"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"},{urls:"stun:bturn2.xirsys.com"}];

function createPeer(){
pc=new RTCPeerConnection({iceServers:bona});
pc.onicecandidate = on_ice_candidate;
pc.oniceconnectionstatechange = on_ice_connection_state_change;
pc.onicegatheringstatechange = on_ice_gathering_state_change;
pc.onicecandidaterror = on_ice_candidate_error;
pc.onnegotiationneeded = on_negotiation_needed;
pc.signalingstatechange = signaling_state_change;
pc.onconnectionstatechange = on_connection_state_change;
pc.ontrack=on_track
return pc;	
}
function on_track(event){
	if(!event.streams[0])
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
onlineDetector.className="puls";// any need?
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
async function handle_offer(sdp, target){
		console.log('in han off: ',sdp);
		var r=confirm("Видеозвонок от "+target+". Принять звонок?");
		//alert(r);
		if(!r){
			wsend({type:"reject_call",target:target,from:myusername});
			stopVideo();
			return;
			}
			if(pc){wsend({type:"reject_call",target:target,from:myusername});return;}
pc=createPeer();
try{
await pc.setRemoteDescription(sdp);
var wstream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
localVideo.srcObject=wstream;

wstream.getTracks().forEach(function(track){pc.addTrack(track,wstream)})

//let l=await pc.createAnswer();
await pc.setLocalDescription(await pc.createAnswer())
wsend({type:"answer","answer":pc.localDescription,"from":myusername,"target":target});


}catch(e){
	console.log(e);
webrtc.innerHTML+=e+'<br>';	
	
}
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
v.className="";
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
	get_profile()},1000)

function on_get_profile(l){
//alert(1);
	console.log(l);
	//id | bname | age |   msg    | ava | isava 
	if(l.info=="ok"){
		clientName.textContent=l.params.bname;
		clientAge.textContent=l.params.age;
		clientMsg.textContent=l.params.msg;
		var d=document.createElement('img');
		d.height="150";
		if(l.params.ava && l.params.isava==2){
		d.src=l.params.ava;
			}else{
				d.src='/images/default.jpg';
				}
				clientFoto.appendChild(d);
	}
}
function on_get_profile_error(l){console.error(l);}
localVideo.onloadedmetadata=function(e){console.log('on local video loaded video data');}
remoteVideo.onloadedmetadata=function(e){console.log('on remote video loaded video data');}











