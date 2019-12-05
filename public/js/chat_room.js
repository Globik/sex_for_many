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
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-user">'+ob.from+':&nbsp;</span><span class="chat-message">'+ob.msg+'</span>';
chat.appendChild(m);
chat.scrollTop=chat.clientHeight+chat.scrollHeight;
}
function insert_notice(ob){
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML='<span class="chat-message">'+ob.msg+'</span>';
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
insert_message(ad);	
}else if(ad.type=="nick"){
clientNick=ad.nick;
set_username();	
}else if(ad.type=="on_btc"){
btcc.textContent=ad.btc_all;
var obj7={};
obj7.from="Анон";
obj7.msg=" шлет "+ad.btc_amt+" сатоши";
insert_message(obj7);
}else if(ad.type=="count"){
	chatcnt.textContent=ad.user_count;
}else if(ad.type=="owner_in"){
	insert_notice({msg:'<b>'+ad.nick+'</b>&nbsp;вошел в чат.'});
}else if(ad.type=="owner_out"){
	insert_notice({msg:'<b>'+ad.nick+'</b>&nbsp;покинул чат.'});
}else if(ad.type=="history"){
	ad.d.forEach(function(el,i){
	insert_message({from:el.nick,msg:el.msg});	
	})
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
//non owner colling the model(one to one)
//by idea ws type call_offer to model, if return call_offer_yes so=> go_webrtc()
go_webrtc();
}
function go_webrtc(){		
navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(function(mstream){
playVideo(localVideo,mstream);
pc=createPeer();
pc.addStream(mstream);
pc.onaddstream=function(e){
remotevideo.srcObject=e.stream;
}
pc.onremovestream=function(){
//handleleave();
console.log('on remove stream');					
}
if(!owner)createOffer();
}).catch(function(er){console.error(er);
webrtc.innerHTML+=er+'<br>';
})
}
function playVideo(element, stream){
if('srcObject' in element){element.srcObject=stream;}
element.play();
element.volume=0;	
}
function createOffer(){
pc.createOffer().then(function(offer){
return pc.setLocalDescription(offer);
}).then(function(){
wsend({type:'offer',offer:pc.localDescription, from:myusername,target:modelName})
}).catch(function(err){
console.error(err);
webrtc.innerHTML+=err+'<br>';
})
}

function createPeer(){
pc=new RTCPeerConnection(ice_server);
pc.onicecandidate = on_ice_candidate;
pc.oniceconnectionstatechange = on_ice_connection_state_change;
pc.onicegatheringstatechange = on_ice_gathering_state_change;
pc.onicecandidaterror = on_ice_candidate_error;
pc.onnegotiationneeded = on_negotiation_needed;
pc.signalingstatechange = signaling_state_change;
pc.onconnectionstatechange = on_connection_state_change;
return pc;	
}

function on_ice_candidate(event){
if(event.candidate){
console.warn("ON ICE CANDIDATE!");
var d={};
d.type="candidate";
d.candidate=event.candidate;
d.from=myusername;
d.target=modelName;
wsend(d);	
}	
}

function on_ice_connection_state_change(){
console.log('ice connection state: ',this.iceConnectionState);
//disconnected failed connected completed
//TODO if 'checking' very long - mark as failed in owner space
if(this.iceConnectionState=="disconnected"){
underVideo.className="";
//if(is_owner()){v.className="";}else{v.className="owner-offline";v.poster="";}
}else if(this.iceConnectionState=="closed"){
if(is_owner()){
v.className="";
//stopVideo();
}
if(!is_owner()){
btnStart.textContent='start';
}
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
function on_negotiation_needed(){console.warn("ON NEGOTIATION NEEDED!");}
function signaling_state_change(){console.log('signaling state: ',this.signalingState);}
function on_connection_state_change(){
console.log('connection state: ', this.connectionState);
if(this.connectionState=="disconnected"){
//stop_stream();
pc.close();
}else if(this.connectionState=="failed"){
	
}else if(this.connectionState=="connecting"){
setTimeout(function(){
//stop_stream();pc.close();pc=null;pubId=0;btnStart.textContent="start";
},3000);
v.className="connecting";
}
}



