var plugin_name="janus.plugin.videoroom";

var session_id=0;
var handle_id=0;
var transaction="";// unique_name + _Number code of request -> "Bob_10"
var room_exists=false;
var pubId=0;//a feed

var v=gid("video-wrapper");
var owner=gid('owner');
var yourNick=gid("yourNick");
var buser=gid("buser");
var modelName=gid("modelName");
var modelId=gid('modelId');
var onlineDetector=gid("online-detector");
var underVideo=gid("under-video");
var txtArea=gid('txtArea');
var btnStart=gid("btnStart");
var sock;
var who_am_i;
var who_is_he;
var roomId=Number(modelId.value);
var roomDesc=0;
var isVid=false;
var isAud=false;
var pc=null;
var localStream;
var offer_opts={offerToReceiveAudio:0, offerToReceiveVideo:0};
var j_timer=null;//keep alive session


//set_user();
//open_socket();
var loc1=location.hostname+':'+location.port;
var loc2='frozen-atoll-47887.herokuapp.com';
var loc3=loc1 || loc2;
var new_uri;

if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}

set_user();
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
function test_cb(){
//let {received_amount, invoice, code,amount,address}=ctx.request.body;
let d={};
d.invoice=invoici.value;
d.received_amount=100;
d.code="ss";
d.amount=40;
d.address="adr";
vax("post","/api/test_cb_smartc",d,on_suc,on_er,null,false);	
}
function on_suc(e){
	console.log(e);
	}
function on_er(){
console.log('err');	
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
//outi("<b>msg: </b>" + evt.data);
on_msg(evt.data)
}
sock.onclose=function(){
console.log("Websocket closed");
clear_keep_alive();
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
d.typ = "msg";
d.msg = escape_html(chatTxt.value);
d.to = modelId.value;
d.from = yourNick.value;
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

function on_msg(data){
var a;
try{a=JSON.parse(data);
}catch(e){console.error(e);return;}
if(a.typ=="janus")
{
if(a.janus=="success"){
if(a.transi=="10"){
session_id=a.data.id;
set_keep_alive();
attach_plugin();
}else if(a.transi=="11"){
session_id=0;
clear_keep_alive();
if(pc)pc.close();
}else if(a.transi=="12"){
handle_id=a.data.id;
if(is_owner()){create_room();}else{list_participants();}
}else if(a.transi=="13"){
handle_id=0;
console.log('detach');
session_destroy();
}else if(a.transi=="14"){
	console.log('on listparticipants');
// for subscribers
if(a.plugindata.data.participants && a.plugindata.data.participants.length > 0){
pubId=a.plugindata.data.participants[0].id;
console.log("pubId: ",pubId);
who_is_he=a.plugindata.data.participants[0].display;
join_room();
}
}else if(a.transi==40){
console.log('create room')	
roomId=a.plugindata.data.room;
room_exists=true;
join_room();
}else if(a.transi==41){
console.log('destroy room')
detach_plugin();
pubId=0;

}else if(a.transi==20){
console.log('exists');
if(a.plugindata.data.videoroom=="success"){
room_exists=a.plugindata.data.exists;
console.log('room exists: ',room_exists);

if(room_exists==false){
console.log("CREATING NEW ROOM");
create_room2();
}else{
join_room();
}
}
}else{
console.log("Unknown transi ",a.transi);
}
}else if(a.janus=="event")
{
if(a.jsep && a.jsep.type=="answer"){
console.log("answer came");
handle_answer(a.jsep);	
}else if(a.jsep && a.jsep.type=="offer"){
console.log("offer came");
//for subscribers
handle_offer(a.jsep);	
}
if(a.transi=="15"){
console.log("ON JOIN ROOM");
if(a.plugindata.data.id){
pubId=a.plugindata.data.id//feed!(for subscribers)
roomId=a.plugindata.data.room;
roomDesc=a.plugindata.data.description;
console.log('description' ,roomDesc);
}
}else if(a.transi=="16"){
console.log('on configure')	
//onlineDetector.className="puls";
}else if(a.transi=="17"){
//unpublish(owner)
onlineDetector.className="";
let d={};
d.typ="outair";
d.from=who_am_i;
d.roomid=roomId;
wsend(d);//notify all subscribers about unpublish
destroy_room();
}else if(a.transi=="18"){
//leave room(subscriber)
stopVideo();
detach_plugin();
let d={};
d.typ="roomnot";//send statistik
d.roomid=modelId.value;
wsend(d);
}else if(a.transi==19){
//janus event
console.log("on subscribe room ");
}else if(a.transi==22){
console.log("on start room: ");
let d={};
d.typ="roomok";
d.roomid=modelId.value;
wsend(d);
}else{console.log("unknown transi ",a.transi);}


}else if(a.janus=="webrtcup"){ 
console.warn("*** WEBRTCUP! ***", data);
}else if(a.janus=="timeout"){
if(session_id !=a.session_id)console.warn("session_id !=a.session_id");
session_id=0;
handle_id=0;
clear_keep_alive();	
}else if(a.janus=="media"){
console.warn("MEDIA! "+data);

if(a.type=="video"){
isVid=a.receiving;	
}else if(a.type=="audio"){
isAud=a.receiving;	
}else{}

}else{}
}else if(a.typ=="joinchat"){
console.log("user_count: ", a.user_count);
chatcnt.textContent=a.user_count;
rviewers.textContent=a.viewers;	
}else if(a.typ=="msg"){
insert_message(a);
}else if(a.typ=="usid"){
set_user();
console.log("who am I?: ", who_am_i);
console.log("modelName.value: ",modelName.value);
pubId=a.pubid;	
chatcnt.textContent=a.user_count;
rviewers.textContent=a.viewers;	
wsend({typ:"onuser", username:modelName.value, owner:is_owner()});// todo remove roomid
}else if(a.typ=="atair"){
//for subscribers
if(!is_owner()){
v.className="owner-online";
}
roomDesc=a.roomdesc;
roomId=a.roomid;
pubId=a.feed;
localVideo.poster=a.src;
if(a.type=="video"){
isVid=a.receiving;

}else if(a.type=="audio"){
isAud=a.receiving;
}else{}
}else if(a.typ=="outair"){
console.log("outair");
//for subscribers;a publisher just unpublished the stream
if(is_owner())return;
pubId=0;
//clear_keep_alive();
stopVideo();
v.className="owner-offline";
v.poster="";
if(pc==null)return;
detach_plugin();
//session_destroy();
let d={};
d.typ="roomnot";
wsend(d);
}else if(a.typ=="on_btc"){
	//donation came
console.log(a);
btcc.textContent=a.btc_all;
//alert('a.btc_all: '+a.btc_all);	
let obj={};
obj.from="unknown";
obj.msg="satoshi sent: "+a.btc_amt;
insert_message(obj);
}else{}

}

function set_user(){
let a=yourNick.value;
if(!a){return;}
who_am_i=a;
transaction=who_am_i;
}

function is_owner(){
return (owner.value=="true"?true:false);	
}
function is_buser(){return (buser.value=="true"?true:false)}


function langi(){
var html=document.getElementsByTagName("html")[0];
html.className="rus";
}


function do_start(el){
if(is_owner()){

if(el.textContent=="start"){
console.log('starting');
CREATE_LOCAL_STREAM();
el.textContent="stop";
}else if(el.textContent=="stop"){
unpublish();
el.textContent="start";
}
}else{
if(el.textContent=="start"){
console.log('creating a session: pubId: ',pubId);
if(pubId==0){console.log('No pubid? Return.');v.poster="";message_box("No stream available");return;}
	session_create();
	el.textContent="stop";	
	}else{
	leave_room();
	el.textContent="start";
	}
}
}

function super_start(){
	//todo remove it?
console.log('super_start()')
if(!is_owner()){console.log('not the owner?');return;}
session_create();
}



function ping(){
let d={};
d.transaction=transaction+"_23";//"ping";
d.janus="ping"
wsend(d);
}
function janus_info(){
let d={};
d.transaction=transaction+"_24";//"info";
d.janus="info";
wsend(d);
}
localVideo.onloadedmetadata=function(e){
	e.target.className="start";
	underVideo.className="start";
	if(is_owner()){
	publish_dva();
}else{}
}
function session_create(){
console.log('session create');
let d={};
d.transaction=transaction+"_10";
d.janus="create";
wsend(d);
}
function session_destroy(){
console.log('session destroy');
let d={};
d.transaction=transaction+"_11";
d.session_id=session_id;
d.janus="destroy";
wsend(d);
}
function attach_plugin(){
let d={};
d.transaction=transaction+"_12";
d.session_id=session_id;
d.janus="attach";
d.plugin="janus.plugin.videoroom";
d.opaque_id="fucker";
wsend(d);
}
function detach_plugin(){
let d={};
d.handle_id=handle_id;
d.transaction=transaction+"_13";
d.session_id=session_id;
d.janus="detach";
d.plugin=plugin_name;
d.opaque_id="fucker";//?? any need? for POST events
wsend(d);	
}

function join_room(){
if(!who_am_i){alert("No who am I?");return;}
let d={};
d.body={};
d.body.request="join";
d.body.room=roomId;
console.log('roomId '+roomId);
d.body.ptype=is_owner()?"publisher":"subscriber";
if(!is_owner()){
if(pubId==0){alert("No pubid feed?");return;}
d.body.feed=pubId;
}
if(is_owner()){
d.body.display=transaction;//?
}
d.transaction=is_owner()?transaction+"_15":transaction+"_19";
d.session_id=session_id;
d.handle_id=handle_id;
d.janus="message";
wsend(d);
}

function create_room(){
if(!is_owner()){console.log('not owner');return;}
if(session_id==0 || handle_id==0){console.log('no session or no handle');return;}
exists_room();
}
function create_room2(){
let d={};
console.log('transaction: ',transaction);
d.transaction=transaction+"_40";
d.session_id=session_id;
d.handle_id=handle_id;
d.janus="message";	
d.body={};
d.body.request="create"
d.body.room=roomId;
d.body.description="fuck me please";
d.body.publishers=1;
wsend(d);
}

function destroy_room(){
let d={
transaction:transaction+"_41",session_id:session_id,
handle_id:handle_id,janus:"message",body:{request:"destroy",room:6666}
}
wsend(d);	
}
function exists_room(){
let d={};
d.body={};
d.body.request="exists";
d.body.room=roomId;//1234;
d.transaction=transaction+"_20";
d.session_id=session_id;
d.handle_id=handle_id;
d.janus="message";	
wsend(d);
}

function list_participants(){
// mainly for subscriber
console.log('list_participants()');
let d={};
d.janus="message";
d.session_id=session_id;
d.handle_id=handle_id;
d.transaction=transaction+"_14";
d.body={};
d.body.request="listparticipants";
console.log('roomId: ',roomId);
d.body.room=roomId;
wsend(d);	
}
function leave_room(){
	//for subscribers
let d={};
d.janus="message";
d.body={};
d.body.request="leave";
d.body.room=roomId;//1234;
d.transaction=transaction+"_18";
d.session_id=session_id;
d.handle_id=handle_id;
wsend(d);	
}
function unpublish(){
//for publisher
if(!is_owner())return;
let d={};
d.body={};
d.body.request="unpublish";
d.body.room=roomId;
d.transaction=transaction+"_17";
d.session_id=session_id;
d.handle_id=handle_id;
d.janus="message";
wsend(d);
}
function list_rooms(){
let d={};	
d.janus="message";
d.body={};
d.body.request="list";
d.body.room=1234;
d.transaction=transaction+"_21";
d.session_id=session_id;
d.handle_id=handle_id;
wsend(d);
}


function set_keep_alive(){
console.warn("setting keep_alive");
if(j_timer !=null){console.warn("why j_timer is not null?");}
j_timer=setTimeout(function tick(){	
  keep_alive();
j_timer=setTimeout(tick, 40000);//50 sec max
}, 10000);
// "bytes-received": 1344533,

}	
function clear_keep_alive(){
console.log("clear_keep_alive");
if(j_timer==null){console.warn("Why j_timer is null??");}
clearTimeout(j_timer);
j_timer=null;	
}

function keep_alive(){
if(session_id==0){console.warn("session is 0");return;}
let d={};
d.janus="keepalive";
d.session_id=session_id;
d.transaction=transaction+"_25";//"keep_alive";
wsend(d);
}


function gotLocalStream(stream){
	// todo remove it
	//for publisher
console.log('for owner');
localStream=stream;
playVideo(localVideo, stream);

pc=createPeer();
localStream.getTracks().forEach(function(track){pc.addTrack(track, localStream)});//owner true
pc.createOffer(offer_opts).then(set_local_desc, on_error);
}
function getiLocal(stream){
localStream=stream;
playVideo(localVideo, stream);
super_start();
}
function CREATE_LOCAL_STREAM(){
if(!is_owner()){return;}

navigator.mediaDevices.getUserMedia({audio:true, video:true}).then(getiLocal)
.catch(function(e){
console.error(e.name,e);
// no webcam or so
message_box("No webcam?");
btnStart.textContent="start";
})	
}
function publish_dva(){
console.log("publish_dva(), creating a peer");
if(!is_owner())return;
pc=createPeer();
localStream.getTracks().forEach(function(track){pc.addTrack(track, localStream)});//owner true
pc.createOffer(offer_opts).then(set_local_desc, on_error);
}

function playVideo(element, stream){
// for owner
if('srcObject' in element){element.srcObject=stream;}
element.play();
element.volume=0;	
}
function stopVideo(){
	
localVideo.pause();
let stream=localVideo.srcObject;
if(stream==null)return;
let tracks=stream.getTracks();
tracks.forEach(function(track){
console.warn('track: ',track);
track.stop();	
})
localVideo.srcObject=null;
}

//localVideo.videoTracks.onaddtrack=function(ev){console.log('a track added: ', ev.track.label);}
//localVideo.videoTracks.onremovetrack=function(ev){alert('track removed');console.log('a track removed: ', ev.track.label);}
localVideo.onended=function(ev){console.log('VIDEO ENDED!');alert('video ended');}
var manda={mandatory:{googlPv6:true}};
function createPeer(){
// for both
pc=new RTCPeerConnection(null, manda);
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
let d={};
d.janus="trickle";
d.transaction=transaction+"_50";
d.session_id=session_id;
d.handle_id=handle_id;
d.candidate=event.candidate;
wsend(d);	
}	
}

function stop_stream(){
	//alert('stop_stream()');
clear_keep_alive();
stopVideo();
detach_plugin();
session_destroy();
}

function on_ice_connection_state_change(){
console.log('ice connection state: ',this.iceConnectionState);
//disconnected failed connected completed
//TODO if 'checking' very long - mark as failed in owner space
if(this.iceConnectionState=="disconnected"){
	underVideo.className="";
if(is_owner()){v.className="";}else{v.className="owner-offline";v.poster="";}
}else if(this.iceConnectionState=="closed"){
if(is_owner()){
v.className="";
stopVideo();
}
if(!is_owner()){
btnStart.textContent='start';
if(pubId==0){v.className='owner-offline';v.poster="";
	//alert('oner-offline');
	}else{
	v.className='owner-online';
	//alert('oner-online');
	}	
}
}else if(this.iceConnectionState=="connected"){
v.className="start";
}else if(this.iceConnectionState=="completed"){
onlineDetector.className="puls";
get_image();
//on air
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
if(is_owner()){
stop_stream();pc.close();pc=null;}else{stop_stream();pubId=0;pc.close();pc=null}
}else if(this.connectionState=="failed"){
	
}else if(this.connectionState=="connecting"){
setTimeout(function(){
//stop_stream();pc.close();pc=null;pubId=0;btnStart.textContent="start";
},3000);

v.className="connecting";
}
}




function set_local_desc(desc){
	//for owner
pc.setLocalDescription(desc).then(function(){
console.log("send offer to janus");
let d={};
d.janus="message";
d.body={};
d.body.request="configure";
d.body.audio=true;
d.body.video=true;
d.transaction=transaction+"_16";
d.session_id=session_id;
d.handle_id=handle_id;
d.jsep=desc;
wsend(d);

}, on_error)
}
function handle_answer(sdp){
//for owner true - publisher
console.warn("handle_answer: \n",sdp);
var ax=new RTCSessionDescription({type:"answer",sdp:sdp.sdp});
pc.setRemoteDescription(ax).then(function(){
console.warn("settled remote sdp");
},on_error)	
}
function on_error(err){console.error("creatin offer err: ", err);}

function handle_offer(sdp){
//if owner false
//set remote sdp,create answer,set local description, start
pc=createPeer();
pc.ontrack=got_remote_stream;

console.log('setRemoteDescription');
pc.setRemoteDescription(sdp).then(function(){;
return pc.createAnswer();
}).then(function(answer){
return pc.setLocalDescription(answer);}).then(function(){
let d={};
d.janus="message";
d.body={};
d.body.request="start";
d.body.room=roomId;
console.log(roomId);
d.transaction=transaction +"_22";
d.session_id=session_id;
d.handle_id=handle_id;
d.jsep=pc.localDescription;
wsend(d);
}).catch(function(er){console.error(er);})

}

function got_remote_stream(stream){
	//owner false - subscriber
console.warn("GOTE_REMOTE_STREAM!");
localVideo.srcObject=stream.streams[0];
localVideo.volume=0;
}

function outi(str){return out.innerHTML+=str+"<br>";}
function wsend(obj){
if(!sock){outi("<b class=\"red\">no websocket available</b>");return;}
let d;
try{d=JSON.stringify(obj);}catch(e){outi("Error sock send json: "+e);return;}	
if(sock.readyState==1)sock.send(d);
}

function get_random_int(max){
return Math.floor(Math.random()*Math.floor(max));	
}

function saveRDesc(el){
if(!txtArea.value)return;	
if(el.textContent="save"){
try{
	localStorage.roomdesc=txtArea.value;
	el.textContent="edit";
}catch(e){}
}else if(el.textContent=="edit"){
el.textContent="save";	
}
}
function fetchRD(){
	/*
if(localStorage.roomdesc){
txtArea.value=localStorage.roomdesc;
btnRD.textContent="edit"	
}else{txtArea.value="";}
*/ 	
}

//fetchRD();
function txtarea_input(el){
	//console.log(el.value);
	//btnRD.textContent="save";
}
	


function get_image(){
console.log("get_image()");
if(!is_owner()) return;
var cnv=document.createElement('canvas');
var w=80;var h=60;
cnv.width=w;cnv.height=h;
var c=cnv.getContext('2d');
c.drawImage(localVideo,0,0,w,h);
var img_data=cnv.toDataURL('image/png',1.0);
let d={};
d.typ="onair";
d.roomdesc="My awsome room description";
d.roomid=roomId;//??
d.nick=transaction;
d.src=img_data;
alert(d.src)
wsend(d)

/*
var  emg=document.createElement('img');
	emg.src=img_data;
	imgContainer.appendChild(emg);
*/
}
