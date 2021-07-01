var v = gid("video-wrapper"),
is_owner = gid('owner'),
yourNick = gid("yourNick"),
is_buser = gid("buser"),
yourLang = gid("yourLang"),
isfake = gid("isfake"),
fakesrc = gid("fakesrc"),
modelName = gid("modelName"),
modelId = gid('modelId'),
chatTxt = gid('chatTxt'),
chat = gid("chat"),
chatcnt = gid("chatcnt"),
underVideo = gid("under-video"),
btnStart = gid("btnStart"),
vasja = gid("vasja"),
btcc = gid("btcc"),
roomdescr = gid("roomdescr"),
ONVAIR = false,
is_vstream_started = false,
is_first_time = false,
is_dopPanel = false,
token_flag = true,
do_starti = false,
dopPanel = gid("dopPanel"),
mediaRecorder,
recordedBlobs,
sourceBuffer,
vsrc = [],
is_playing = false,
current_playing = null,
the_time,
ava_file,
spanWhosOn = gid("spanWhosOn"),
sock,
myusername,
clientNick,
localVideo = gid("localVideo"),
remoteVideo = gid("remoteVideo"),
localStream,
targetusername,
pc, dc,
hasAddTrack = false,
bon_ice,
wstream = null,
is_webcam = false,

ice_server = {"iceServers": []};

var BTC_ENABLE = true;

var loc1=location.hostname+':'+location.port;
var loc2=location.hostname;
var loc3=loc1 || loc2;
var new_uri;
var FROM_SUKA;
var IS_GRATIS=true;
var NOT_GRATIS_TIMER;
var IS_PRIVAT=false;
var dynamic_str='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 18h-7v-12h7v12zm2-12v12l11 6v-24l-11 6z"/></svg>';
var undynamic_str='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 1.269l-18.455 22.731-1.545-1.269 3.841-4.731h-1.827v-10h4.986v6.091l2.014-2.463v-3.628l5.365-2.981 4.076-5.019 1.545 1.269zm-10.986 15.926v.805l8.986 5v-16.873l-8.986 11.068z"/></svg>';
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}

function insert_img(){
window.location.href = "#insImg";
}	
function send_ws_img(){
var forImg = gid("forImg");
if(!forImg.value)return;
window.location.href = "#.";
rem_hash();	
let d = {};
d.type = "msg";
d.msg = '<img src="' + forImg.value + '" height="80px"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
forImg.value = "";
}

function owner(){return (is_owner.value === 'true' ? true: false);}
function buser(){return (is_buser.value === 'true'?true:false);}
function fake(){return (isfake.value === 'true' ? true: false);}
function fake_src(){return fakesrc.value;}

function give_token(){
	if(!buser()){
window.location.href = "#vorlogery";
var dikStr = gid("vorlogincontainer").innerHTML = gid("loginStr").value;
}else{
var nu = Number(tokencntnav.textContent);
if(nu == 0){
window.location.href = "/tokens";	
}else{
if(nu > 0){
	if(token_flag){
	token_flag = false;
	let d = {};
	d.type ='tokentransfer';
	d.id = modelId.value;
	d.modelname = modelName.value;
	d.from = myusername;
	d.amount = 1;
	wsend(d);	
	}
}	
}	
}
}

open_socket();

function saveBTC(el){
if(!btcInput.value){return;}
let d = {};
d.btc_client = btcInput.value;
d.username = modelName.value;
vax("post", "/api/savebtcaddress", d, on_saved_btc, on_save_btc_error, el, false);
el.classList.add("puls");
}

function on_saved_btc(d,el){
	let s = (yourLang.value == 'ru' ? 'Адрес сохранен!' : 'Address saved!');
note({content: s, type: "info", time: 5});
el.classList.remove("puls")
el.disabled = true;
}

function on_save_btc_error(l, el){
el.classList.remove("puls");
let span = crel("span","\t"+l,"red");
insert_after(span, bInput,"span");
}

function reset_btc(){
btcInput.value = "";
del_after(bInput, "span");
btnSaveAdr.disabled = false;	
}

function get_natural(){
var im = document.getElementById("imgavatar");
if(!im)return;
return {w: im.naturalWidth, h: im.naturalHeight};
}

function datauri_toblob(s){
var binary = atob(s.split(',')[1]);
var a_r = [];
for(var i = 0; i < binary.length; i++){
	a_r.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(a_r)], {type: 'image/jpeg'});	
	}
	
function thumb(ev){
while(avacontainer.firstChild){avacontainer.removeChild(avacontainer.firstChild);}
var imgA = document.createElement('img');
var cnvA = document.createElement('canvas');
var ctxA = cnvA.getContext('2d');
imgA.src = window.URL.createObjectURL(ev[0]);
imgA.id = "imgavatar";
//imgA.height = 200;
avacontainer.appendChild(imgA);
imgA.onload = function(){
	window.URL.revokeObjectURL(imgA.src);
var l = get_natural();
console.log(l);
if(l)
var wi = (l.w > 1000 ? l.w/4: l.w);
var hi = (l.w > 1000 ? l.h/4: l.h);
cnvA.width = wi;
cnvA.height = hi;
ctxA.drawImage(imgA, 0, 0, wi, hi);
var ava_str = cnvA.toDataURL('image/jpeg', 0.4);
ava_file = datauri_toblob(ava_str);
	}}


var profile_form = document.forms.avaprofi;
	if(profile_form)profile_form.addEventListener('submit', on_submit_ava, false);
function on_submit_ava(ev){
ev.preventDefault();
var dich = new FormData(profile_form);

if(ava_file){
	console.log(ava_file);
	var fileA = new File([ava_file], modelName.value+'_' + randomStr.value + '.jpg', {type:'image/jpeg'});
	console.log(ava_file);
dich.append("canvasImage", fileA);
}
vax(ev.target.method, ev.target.action, dich, on_profile_saved, on_profile_err, ev.target, true);
ev.target.className = "puls";	
}

function on_profile_saved(l, ev){
console.log(l);
ev.className = "";
note({content: l.info, type:"info", time: 5});
imgavatar.src = l.path;
wsend({type:"new_ava", name:myusername, avasrc:l.path, id:modelId.value});
}

function on_profile_err(l,ev){ev.className = "";note({content: l, type:"error", time: 5});}







var alter_form = document.forms.alterform;
	if(alter_form)alter_form.addEventListener('submit', on_submit_alter, false);
function on_submit_alter(ev){
ev.preventDefault();
let d = {};
d.name = ev.target.fname.value;
d.alter = ev.target.alter.value;
//alert(d.name + d.alter);
//return;
vax(ev.target.method, ev.target.action, d, on_alter_saved, on_alter_err, ev.target.submit, false);
ev.target.className = "puls";	
}

function on_alter_saved(l, ev){
console.log(l);
ev.className = "";
note({content: l.info, type:"info", time: 5});
}

function on_alter_err(l,ev){ev.className = "";
note({content: l, type:"error", time: 5});
}





var sex_form = document.forms.sexform;
	if(sex_form)sex_form.addEventListener('submit', on_submit_sex, false);
function on_submit_sex(ev){
ev.preventDefault();
let d = {};
d.name = ev.target.fname.value;
d.sexorient = ev.target.sexorient.value;
//alert(d.name + d.sexorient);
//return;
vax(ev.target.method, ev.target.action, d, on_sex_saved, on_sex_err, ev.target.submit, false);
ev.target.className = "puls";	
}

function on_sex_saved(l, ev){
console.log(l);
ev.className = "";
note({content: l.info, type:"info", time: 5});
}

function on_sex_err(l,ev){ev.className = "";
note({content: l, type:"error", time: 5});
}

















function foto_error(el){
var avid = el.getAttribute('data-avid');
if(!avid)return;
var d = {};
d.avid = avid;
d.src = el.src;
//vax("post", "/api/foto_error", d, on_foto_error, on_foto_error_err, el, false);
}
function on_foto_error(l,ev){}

function on_foto_error_err(l,ev){}

function change_language(el){
let d = {};
d.lang = el.value;
d.bname = modelName.value;
vax("post", "/api/save_language", d, on_change_language, on_change_language_err, null, false);
	}

function on_change_language(l){
	location.reload();
	}

function on_change_language_err(l){
	note({content: l, type: "error", time: 5});
	}

function save_status(el){
	let s = (yourLang.value == 'ru' ? "Заполните статус" : "Fill out the status");
if(!roomdescr.value){note({content: s, type: "error", time: 5});return;}
var d = {};
d.bname = el.getAttribute('data-bname');
d.status = roomdescr.value;
vax("post", "/api/save_status", d, on_save_status, on_save_status_err, el, false);
el.className = "puls";
}

function on_save_status(l, el){
note({content: l.info, type: "info", time: 5});
el.className = "";	
}

function on_save_status_err(l, el){
note({content: l, type: "error", time: 5});
el.className = "";	
}

function open_socket(){
if(sock){console.log("already in connection");return;}

sock = new WebSocket(new_uri+'//'+loc3+'/'+modelId.value);

sock.onopen = function(){
console.log("websocket opened")
}

sock.onerror = function(e){
console.log("websocket error ", e);
}

sock.onmessage = function(evt){
console.log("message", evt.data);
on_msg(evt.data)
}

sock.onclose = function(){
console.log("Websocket closed");
chatcnt.textContent = 0;
}
}

function sendi(ev){
if(ev.key === "Enter"){
send_up();
}
}

chatTxt.addEventListener('keydown', sendi, false);

function send_up(el){
if(!chatTxt.value)return;
let d = {};
d.type = "msg";
d.msg = chatTxt.value;
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
console.log(d)
wsend(d);	
if(el)el.className = "puls";
chatTxt.value = "";
}
function insert_message(ob){
vasja.className = "";
var m=document.createElement('div');
m.className = "chat-div";
m.innerHTML = '<span class="chat-user">' + ob.from + ': </span><span class="chat-message">' + ob.msg + '</span>';
m.innerHTML+= '<div class="g-data">' + g_data(ob.tz) + '</div>';
chat.appendChild(m);
chat.scrollTop = chat.clientHeight + chat.scrollHeight;
}

function insert_notice(ob){
var m = document.createElement('div');
m.className = "chat-div";
m.innerHTML = '<span class="chat-message">' + ob.msg + '</span>';
m.innerHTML+= '<div class="g-data">' + g_data(ob.tz) + '</div>';
chat.appendChild(m);
chat.scrollTop = chat.clientHeight+chat.scrollHeight;
}
function escape_html(s){
var ix = s.replace(/[&<>"]/g, function(m){return '';})	
return ix;
}

function set_username(){
myusername = (owner() ? modelName.value: (buser() ? yourNick.value: clientNick));
wsend({type: "username", owner: owner(), name: myusername,roomname: modelName.value});
}

function on_msg(data){
try{
var ad = JSON.parse(data);
}catch(e){console.error(e);return;}
if(ad.type == "msg"){
	ad.tz = new Date();
insert_message(ad);	
}else if(ad.type == "nick"){
clientNick = ad.nick;
set_username();	
}else if(ad.type == "on_btc"){
btcc.textContent = ad.btc_all;
var obj7 = {};
obj7.from = "Анон";
obj7.msg = " шлет " + ad.btc_amt + " сатоши";
obj7.tz = new Date();
if(ad.btc_amt > 0){insert_message(obj7);}
}else if(ad.type == "count"){
	chatcnt.textContent = ad.user_count;
	if(ad.on_vair){
	if(!owner()){v.className = "connecting";	}
	}else{}
	if(!ad.online){
		if(!owner()){v.className = "offline";}
		}else{
		if(!owner()){
				if(!IS_PRIVAT){
					v.className = "notowner";
					}
				if(ad.privat){v.className = "privat";}
				}
			}
	if(fake())chatcnt.textContent = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}else if(ad.type == "privat"){
	if(!owner()){
		if(!IS_PRIVAT){
		v.className = "privat";
	}
		}
	}else if(ad.type == "unprivat"){
	if(!owner()){
		v.className = "notowner";
		}
		if(owner()){
			v.className = "webcamowner";
			}
	}else if(ad.type == "tokentransfer"){
tokencc.textContent = ad.plus;	
if(owner()){
	tokencntnav.textContent = ad.plus;
	tokencntnav2.textContent = ad.plus;
	let s = (yourLang.value == 'ru' ? "Поздравляем, у вас " + ad.plus + "токенов!" : "Congratulations! You got " + ad.plus + "tokens!");
	note({content: s, type: info, time: 5});
}
if(buser()){
if(!owner()){
tokencntnav.textContent = ad.minus;
tokencntnav2.textContent = ad.minus;
token_flag = true;
}
}	
insert_message({from: ad.from, msg: (yourLang.value == 'ru' ? "шлет " : "sends ") + ad.amount + (yourLang.value == 'ru' ? " токен." : "token"), tz: new Date()});
}else if(ad.type == "owner_in"){
	insert_notice({msg: '<b>' + ad.nick + '</b>&nbsp;' + (yourLang.value == 'ru' ? 'вошел в чат.' : 'entered chat.'), tz: new Date()});
	if(!owner()){v.className = "notowner";}
}else if(ad.type == "owner_out"){
	if(!owner()){v.className = "offline";}
	insert_notice({msg: '<b>' + ad.nick + '</b>&nbsp;' + (yourLang.value == 'ru' ? 'покинул чат.' : 'left chat.'), tz: new Date()});
}else if(ad.type == "history"){
	ad.d.forEach(function(el, i){
	insert_message({from: el.nick, msg: el.msg, tz: el.tz});	
	})
}else if(ad.type == "no_target"){
stop_failure(ad);//for non owner
}else if(ad.type == "offer"){
	FROM_SUKA = ad.from;
handle_offer(ad.offer, ad.from);	
}else if(ad.type == "answer"){
handle_answer(ad.answer);	
}else if(ad.type == "candidate"){
handle_candidate(ad.candidate);	
}else if(ad.type == "privat_wanted"){
if(owner()){privat_wanted(ad.from, ad.amount);}
}else if(ad.type == "reject_privat"){
	var s_str =  (yourLang.value == 'ru' ? "Пожалуйста, (до)купите токенов для платного приват-чата." : "Please purchase tokens for privat chat.");
if(!owner()){
IS_GRATIS = ad.gratis;
note({content: ad.from + (yourLang.value == 'ru' ? ' отклонил звонок.\n' : ' rejected call\n') + (ad.grund ? ad.grund: '') + (!ad.gratis ? s_str: ''), type: 'info', time: 10});
}
}else if(ad.type == "accept_privat"){
handle_accept_privat(ad);	
}else if(ad.type == "spanWhosOn"){
if(spanWhosOn)spanWhosOn.textContent = ad.cnt;
vax("post", "/api/onesignal_count", {cnt: ad.cnt, desc:"chat room"}, function(){}, function(){}, null, false);
}else if(ad.type == "on_vair"){
vsrc.push(ad.vsrc);plad();
if(ad.is_first == "true"){
ONVAIR = true;
if(!owner()){
localVideo.style.display = "none";
v.className = "connecting";
	}
}
if(ad.is_active == "false"){
ONVAIR = false;	
if(!owner()){
	localVideo.style.display = "block";
	v.className = "streaminterupt";
	}
}else{
	ONVAIR = true;
	v.className = "";
	}	
}else if(ad.type == "out_vair"){
ONVAIR = false;
vsrc = [];
if(owner()){
if(is_webcam){
	v.className = "webcamowner";
	}	
}else{
	v.className = "streaminterupt";
	}
}else if(ad.type == "btc_enable"){
alert("btc_enable");
BTC_ENABLE = false;	
	}else{
console.log('unknown type: ' + ad.type);	
}

}
function wsend(obj){
if(!sock)return;
try{
sock.send(JSON.stringify(obj));	
}catch(e){}	
}

// WEBRTC STUFF
var tokencntnav = gid("tokencntnav");

function begin_privat(el){
var ti = 0;
if(owner()){return;}
if(IS_PRIVAT){
	let s = (yourLang.value == 'ru' ? 'Уже в привате!' : 'Already in privat!');
note({content: s, type: "info", time: 5});
return;
}
if(tokencntnav){
 var t = Number(tokencntnav.textContent);
ti=t;
}
wsend({type: "privat_wanted", target: modelName.value, from: myusername, amount: ti})
}

var sifilis;

function privat_wanted(from, amount){
if(IS_PRIVAT){
wsend({type: "reject_privat", target: from, from: myusername, grund: "Already in privat!"});
return;
}
console.log('is_webcam: ',is_webcam);
sifilis = from;
FROM_SUKA = from;
window.location.href = "#privatid";
privatdialog.setAttribute('data-target', from);
let s = (yourLang.value == 'ru' ? "Запрос на приват от " + from + ". Токенов " + amount + ". \nПриват-шоу максимум на " + amount + " минут. \nПринять?" : "Privat call from " + from + ". Tokens " + amount + ". \nPrivat show maximum " + amount + " minutes long. \nAccept?");
privatdialog.textContent = s;	
}

function gno(el){
window.location.href = "#.";
in_rem_hash();
var fl = privatdialog.getAttribute('data-target');
wsend({type: "reject_privat", target: fl, from: myusername, gratis: ifGratis.checked});
}

function gyes(el){
window.location.href = "#.";
in_rem_hash();
var fl = privatdialog.getAttribute('data-target');
wsend({type: "accept_privat", target: fl, from: myusername, gratis: ifGratis.checked});	
}

function handle_accept_privat(n){
if(!owner()){
console.log('is_webcam: ',is_webcam);
stopVideo();
is_webcam = false;
vsrc = [];	
go_webrtc();
IS_GRATIS = n.gratis;
}
if(owner()){
}	
}

function stop_privat(el){
	console.warn("IS_PRIVAT:", IS_PRIVAT);
	stopVideo();
	IS_PRIVATE = false;
	el.disabled = true;
if(NOT_GRATIS_TIMER){clearTimeout(NOT_GRATIS_TIMER);}
IS_GRATIS = true;
if(owner(){
	//wsend({});
	}
}
	
function go_webrtc(el){	
var constraints = {audio: {echoCancellation: {exact: true}},video: {width: 1280, height: 720}};
navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
if(!owner()){
localVideo.srcObject=stream;
localVideo.play();
localVideo.volume = 1;
pc = createPeer();
stream.getTracks().forEach(function(track){pc.addTrack(track,stream)})
pc.createOffer().then(function(offer){
return pc.setLocalDescription(offer)}).then(function(){
wsend({type:'offer', offer: pc.localDescription, from: myusername, target: modelName.value});
	})
}else{
if(owner()){
window.stream = stream;
localVideo.srcObject = stream;
is_video_transfer = true;
}	
}	
}).catch(function(err){
console.error(err);
if(err.name == "NotFoundError"){
note({content: (yourLang.value == "ru" ? "Включите веб-камеру." : "Enable web camera."), type: "error", time: 5});
}else{note({content: err.name, type: "error", time: 5});}
if(!owner())btnStart.disabled = false;
webrtc.innerHTML+= err + '<br>';
if(owner())is_video_transfer = false;
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
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function(stream){
localVideo.srcObject = stream;
setTimeout(do_slepok, 1000);
}).catch(function(err){
console.error(err.name);
if(err.name == "NotFoundError"){
note({content: (yourLang.value == "ru" ? "Включите веб-камеру." : "Enable web camera."), type: "error", time: 5});
}else{note({content: err.name, type: "error", time: 5});}
});
}

function do_slepok(b){
var cnv = document.createElement('canvas');
var w = 80;var h = 60;
cnv.width = w;
cnv.height = h;
var c = cnv.getContext('2d');
c.drawImage(localVideo, 0, 0, w, h);
var img_data = cnv.toDataURL('image/png', 1.0);
if(b){
return img_data;	
}else{
var d = {};
d.type = "msg";
d.msg = '<img src="' + img_data + '" height="80px" style="vertical-align:middle;"/>';
d.roomname = modelName.value;
d.from = myusername;// yourNick.value;
wsend(d);
}
if(!is_webcam)stopVideo();
}

function get_slepok(){
	return do_slepok(true);
}

var suona = [{urls: [
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
try{liushka = JSON.parse(xirTarget.value);}catch(e){console.error("Xirsys ice servers not available");}
var bona = (xirTarget.value ? [liushka]: null);
var donat = (bona ? {"iceServers": bona}: null);
console.warn("donat: ", donat);

const dona = {iceServers: suona};

function createPeer(){
pc = new RTCPeerConnection(donat);
pc.onicecandidate = on_ice_candidate;
pc.oniceconnectionstatechange = on_ice_connection_state_change;
pc.onicegatheringstatechange = on_ice_gathering_state_change;
pc.onicecandidaterror = on_ice_candidate_error;
pc.onnegotiationneeded = on_negotiation_needed;
pc.signalingstatechange = signaling_state_change;
pc.onconnectionstatechange = on_connection_state_change;
if(!owner()){
dc = pc.createDataChannel('globi');
dc.onopen = on_channel_state_change;
dc.onclose = on_channel_state_change;
dc.onmessage = on_receive_message;
}
pc.ondatachannel = receive_channel_cb;
pc.ontrack = on_track
return pc;	
}

function on_channel_state_change(){
var readyState = dc.readyState;
console.log('send channel state is: ', readyState);
if(readyState == "open"){
	on_display(false);
	}else{
		on_display(true);
		}	
}

function receive_channel_cb(event){
	dc = event.channel;
	dc.onmessage = on_receive_message;
	dc.onopen = on_channel_state_change;
	dc.onclose = on_channel_state_change;
}

function on_receive_message(event){
console.log('data channel: ', event.data);

var div = document.createElement("div");
try{
msg_came();
var a = JSON.parse(event.data);
div.innerHTML = '<b>' + a.from + ':</b> ' + a.msg;
}catch(e){return;}
privatchat.appendChild(div);
privatchat.scrollTop = privatchat.clientHeight + privatchat.scrollHeight;
}


function send_channel(obj){
if(dc){
	try{
dc.send(JSON.stringify(obj));	
}catch(e){}
}	
}

function on_display(bool){
	console.log('bool: ',bool);
	if(!bool){
		privatcontainer.classList.add("ondisplay");
		}else{
			privatcontainer.classList.remove("spanout");
			privatcontainer.classList.remove("ondisplay");
			privatpanel.classList.remove('msg-in');
			}
	}

var pflag = false;

function on_span(){
if(!pflag){
console.log(pflag);	
privatcontainer.classList.add("spanout");
privatpanel.classList.remove("msg-in");
pflag = true;
}else{
console.log(pflag);
privatcontainer.classList.remove("spanout");
pflag = false;	
}
}

function msg_came(){
if(!privatcontainer.classList.contains('spanout'))privatpanel.classList.add('msg-in');	
}

privatinput.addEventListener('keypress', dc_send, false);

function dc_send(ev){
if(ev.keyCode == 13 || ev.which == 13 || ev.key == "Enter"){
console.log(ev.target.value);
if(!ev.target.value)return;
var obj = {};
obj.from = myusername;
obj.msg = ev.target.value;
send_channel(obj);
var div = document.createElement("div");
div.innerHTML = '<b>' + myusername + ':</b> ' + ev.target.value;
privatchat.appendChild(div);
privatchat.scrollTop = privatchat.clientHeight + privatchat.scrollHeight;
ev.target.value = "";
}
}

function dopPanel_out(el){
if(!is_dopPanel){
is_dopPanel = true;
dopPanel.className = "dopPanel_out";		
}else{
is_dopPanel = false;	
dopPanel.className = "";
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
vStreamStart.disabled = true;
v.className = "owner";
}
}

function start_stream(el){

if(el.textContent == (yourLang.value == "ru" ? "Старт стрим" : "Start stream")){
startRecording();
el.className = "active";
is_vstream_started = true;
is_first_time = true;
the_time = new Date().getTime();
el.textContent = (yourLang.value == "ru" ? "Стоп стрим" : "Stop stream");
v.className = "";
webcamStart.className = "";
webcamStart.disabled = true;

}else{

stopRecording();
is_vstream_started = false;
webcamStart.disabled = false;
webcamStart.className = "active";

el.className = "";
el.textContent = (yourLang.value == "ru" ? "Старт стрим" : "Start stream");

if(owner()){
v.className = "owner";
}else{}	
}	
}

function stoping_recording(){
stopRecording();
is_vstream_started = false;
webcamStart.disabled = false;
webcamStart.className = "active";
vStreamStart.className = "";
vStreamStart.textContent = (yourLang.value == "ru" ? "Старт стрим" : "Start stream");
if(owner()){
v.className = "owner";
}else{}
}

var kik = 0;
var dik = 0;
var tinterval;
var figa_timer = false;

function startRecording(){
if(figa_timer){figa_timer = false;}
recordedBlobs = [];
var opti = {mimeType: 'video/webm;codecs=vp9'};
if(!MediaRecorder.isTypeSupported(opti.mimeType)){
	console.error(opti.mimeType + ' is not supported');
	webrtc.innerHTML+= opti.mimeType + ' is not supported<br>';
	opti = {mimeType: 'video/webm;codecs=vp8'};
	if(!MediaRecorder.isTypeSupported(opti.mimeType)){
		console.error(opti.mimeType + ' is not supported');
		webrtc.innerHTML+= opti.mimeType + ' is not supported<br>';
		opti = {mimeType: 'video/webm'};
		if(!MediaRecorder.isTypeSupported(opti.mimeType)){
			console.error(opti.mimeType + ' is not supported');
			webrtc.innerHTML+= opti.mimeType + ' is not supported<br>';
			opti = {mimeType: ''};
			}
		}
	}
	try{
		var vopti = {mimeType:'video/webm'}
		mediaRecorder = new MediaRecorder(window.stream,vopti);
		}catch(e){
			console.error('mediarecorder err: ', e);
			is_vstream_started = false;
			is_first_time = false;
			vStreamStart.textContent = "Стоп стрим";
			vStreamStart.className = "";
v.className = "";
webcamStart.className = "active";
webcamStart.disabled = false;
			return;
			}
			
			mediaRecorder.onstart = function(){
				console.warn("On start");
				console.log('vsrc: ',vsrc);
				v.className = "connecting";
				dik++;
				}
			mediaRecorder.onerror = function(){console.error('error');}
			mediaRecorder.onpause = function(ev){
				console.log('on pause',ev);
}
			mediaRecorder.onresume = function(){
				dik+= 1;
				console.log('on resume');
				}
			
mediaRecorder.onstop = function(event){
console.warn('recorder stopped ', event);
console.log('recorded blobs: ', recordedBlobs);
console.log("kik: ",kik);
save_video_file();
}
mediaRecorder.ondataavailable = handlDataAvailable;
if(!figa_timer){
setTimeout(function(){
if(mediaRecorder.state == 'inactive')return;
mediaRecorder.stop();
}, 10000);//60000
}
mediaRecorder.start();
console.warn('mediaRecorder started ');
}

function save_video_file(){
var file = new File(recordedBlobs, modelName.value + '_' + dik + '.webm', {type: 'video/webm'});
console.warn('mimeType: ', mediaRecorder.mimeType);
webrtc.innerHTML+= ' mimeType: ' + mediaRecorder.mimeType + '<br>';

var form_data = new FormData();
form_data.append('vn', file.name);
form_data.append('v', file);
form_data.append('room_id', modelId.value)
form_data.append('room_name', modelName.value);
form_data.append('is_active', is_vstream_started);
if(ifRecord.checked){
form_data.append('is_record', true);
form_data.append('recordArr', JSON.stringify({d:vsrc}));
}else{
form_data.append('is_record', false);	
}
form_data.append('is_first', is_first_time);
console.warn('vsrc: ', vsrc);
vax("post", "/api/save_video", form_data, on_save_video, on_save_video_error, null, true);
}

function on_save_video(l){
console.log(l);	
if(!figa_timer){
startRecording();
is_first_time = false;
}else{dik = 0; is_first_time = false;}

var min_1 = new Date().getTime();
var min_2 = (min_1 - the_time) / 60000;
var min_3 = Math.round(min_2);
var min_time;
var min_str;
if(min_3 >= 60){
	min_time = (min_3 / 60).toFixed(2);
	min_str = 'ч';
}else{
	min_time = (min_3==0?1:min_3);
	min_str = 'мин';
	}
let d = {};
d.type = "on_vair";
d.is_first = l.is_first;
d.is_active = l.is_active;
d.vsrc = l.vsrc;
d.src = (l.is_first == 'true' ? get_slepok(): '');
d.room_id = l.room_id;
d.room_name = l.room_name;
d.descr = roomdescr.value;
d.min_time = min_time;
d.min_str = min_str;
d.v=chatcnt.textContent;
wsend(d);	
if(l.is_active == "false"){
var d2 = {};
d2.type = "out_vair";
d2.is_first = l.is_first;
d2.is_active = l.is_active;
d2.vsrc = l.vsrc;
d2.room_id = l.room_id;
d2.room_name = l.room_name;
wsend(d2);
}
}

function on_save_video_error(l){
console.error(l);	
}

function stopRecording(){
if(!mediaRecorder)return;
figa_timer = true;
if(mediaRecorder.state != "inactive")
mediaRecorder.stop();
is_vstream_started = false;
} 

function handlDataAvailable(event){
console.warn("DATA AVAILABLE");	
if(event.data && event.data.size > 0){
recordedBlobs.push(event.data);	
}
}
var q_n = 10;
function plad(){
if(!is_playing){
console.log('vsrc: ', vsrc);
console.log('vsrc.length: ', vsrc.length);
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
if(is_vstream_started == false){return;}
}else{
if(!ONVAIR)return;	
}
try{
console.log('N: ', n)
current_playing = n;
remoteVideo.src = n;
remoteVideo.muted = true;
}catch(er){console.log('err: ', er);}
}

localVideo.onloadedmetadata = function(e){
	console.log('on local video loaded video data');
	if(owner()){
		webcamStart.className = "active";
		is_webcam = true;
		vStreamStart.disabled = false;
	}
	}
	remoteVideo.onloadedmetadata = function(e){
		console.log('on remote video loaded video data');
		remoteVideo.play();
		if(!owner()){
		}
		}

remoteVideo.onplaying = function(){
is_playing = true;
console.log("it's playing");
console.log('ONVAIR: ', ONVAIR);
v.className = "";	
if(!owner()){
	}
}
remoteVideo.onended = function(){
console.log('remote video ended');
is_playing = false;
console.log('is_vstream_started: ', is_vstream_started);
console.log('is_webcam: ', is_webcam);
if(is_vstream_started){v.className = "connecting";}else{
if(owner()){
if(is_webcam){
v.className = "webcamowner";	
}else{
v.className = "owner";
}
}else{
	console.log('ONVAIR: ', ONVAIR);
if(ONVAIR){v.className = "connecting";}else{v.className = "streaminterupt";}	
}
}
if(ONVAIR)plad();
}

if(fake()){
remoteVideo.src = '/vid/' + fakesrc.value;
remoteVideo.muted = true;
remoteVideo.loop = "loop";
v.className = "";
tokencc.textContent = 24;
conversation();
}
var popa_flag = false;

function popa(el){
	if(!popa_flag){
		popa_flag = true;
		el.innerHTML = dynamic_str;
remoteVideo.muted = false;	
}else{
popa_flag = false;
el.innerHTML = undynamic_str;
remoteVideo.muted = true;	
}
}

function conversation(){
let ab = ["давай, давай!", "ух ты",  "писька пиздатая", "ну и сиськи", "задница зашибись", "ну и попка", "молодец!","так держать", "ну и ну"];
let names = ["Nicky", "Sveta", "lettali", "haylix", "xaevynne", "sexyru_couple", "miss_julia", "sasha", "kaileeshy", "wowgirls", "john", "mik","dura"];

let a = Math.floor(Math.random() * (ab.length - 1));
let b = ab[a];
let c = Math.floor(Math.random() * (names.length - 1));
let d = names[c];
insert_message({from: d, msg: b, tz: new Date()});
setTimeout(conversation, 60000);
dummi_token();
}

function dummi_token(){
var nameD = ["Nicky", "Sveta", "lettali", "haylix", "xaevynne", "sexyru_couple", "miss_julia", "sasha", "kaileeshy", "wowgirls", "john", "mik","dura"];
let c = Math.floor(Math.random() * (nameD.length - 1));
let d = nameD[c];
insert_message({from: d, msg: "шлет на чай один токен.", tz: new Date()});
insert_message({from: modelName.value, msg: "Спасибо, " + d + "!", tz: new Date()});
tokencc.textContent = Number(tokencc.textContent) + 1;
setTimeout(dummi_token, 58000);	
}

function del_video(el){
let a = el.getAttribute('data-bid');
let e = el.getAttribute('data-src');
if(!a || !e)return;
if(confirm((yourLang.value == "ru" ? "Удалить видео?" : "Remove video?"))){
var d = {};
d.vid = a;
d.src = e;
vax("post", "/api/video_deleteUs", d, on_video_del, on_video_del_error, el, false);
el.className = "puls";
}
}

function on_video_del(l, ev){
ev.className = "";
note({content: l.info, type: "info", time: 5});	
var s = document.querySelector('[data-id="' + ev.getAttribute('data-bid') + '"]');
if(s)s.remove();
}

function on_video_del_error(l, ev){
ev.className = "";
note({content: l, type: "error", time: 5});	
}

function vplay(el){
var a = el.getAttribute('data-vid');
if(!a)return;
let d = {};
d.vid = a;
vax("post", "/api/video_views", d, on_video_views, on_video_views_error, null, false);
}

function on_video_views(l){
console.log(l);	
}
function on_video_views_error(l){console.error(l);}

function handleSourceOpen(){}

function on_track(event){
	remoteVideo.srcObject = event.streams[0];
}

function on_ice_candidate(event){
if(event.candidate){
console.warn("ON ICE CANDIDATE!");
let d = {};
d.type = "candidate";
d.candidate = event.candidate;
console.log('myusername: ', myusername);
console.log('modelName.value: ', modelName.value);
d.from = myusername;
d.target = (owner() ? FROM_SUKA: modelName.value);
wsend(d);	
}	
}

function handle_candidate(cand){
if(pc)pc.addIceCandidate(cand)	
}

function on_ice_connection_state_change(){
console.log('ice connection state: ',this.iceConnectionState);
if(this.iceConnectionState == "disconnected"){
STOP_PRIVAT();
}else if(this.iceConnectionState == "closed"){
STOP_PRIVAT();
stopVideo();
if(owner()){
	SEND_UNPRIVAT();
}else{
v.className = "notowner";	
}
}else if(this.iceConnectionState == "connected"){
v.className = "start";
	BEGIN_PRIVAT();
}else if(this.iceConnectionState == "completed"){
v.className = "start";
}else if(this.iceConnectionState == "failed"){
STOP_PRIVAT();
}else{}	
}

function STOP_PRIVAT(){
stopPrivat.disabled = true;
IS_PRIVAT = false;
underVideo.className = "";
stopVideo();
note({content: (yourLang.value == "ru" ? "Приват закончился!" : "Privat stopped!"), type: "info", time: 5});
if(!owner()){
	IS_GRATIS = true;
	if(NOT_GRATIS_TIMER){clearTimeout(NOT_GRATIS_TIMER);}
}
}

function SEND_UNPRIVAT(){
let d = {};
d.type = 'unprivat';
d.id = modelId.value;
d.modelname = modelName.value;
d.from = myusername;
wsend(d);
v.className = "webcamowner";
}

function BEGIN_PRIVAT(){
	stopPrivat.disabled = false;
	IS_PRIVAT = true;
	note({content: (yourLang.value == "ru" ? "Приват начался" : "Privat just begone"), type: "info", time: 5})
	}

var absuka = 0;

function gavno_ticker(){
	if(!BTC_ENABLE){
		note({content: "Sorry, the service now is unavailable! Try again later", type: "info", time: 5});
		return;
		}
if(!owner()){
	if(buser()){
	note({content: (yourLang.value == "ru" ? "Минута прошла - токен ушел" : "a minute gone and token away"), type: "info", time: 5})
	NOT_GRATIS_TIMER = setTimeout(function(){
		absuka+= 1;
		console.log('absuka: ', absuka);
	let d = {};
	d.type = 'tokentransfer';
	d.id = modelId.value;
	d.modelname = modelName.value;
	d.from = myusername;
	d.amount = 1;
	wsend(d);
	NOT_GRATIS_TIMER = setTimeout(gavno_ticker, 10000)
	}, 10000)
	}
}
	}

function on_ice_gathering_state_change(){
	console.log("ice gathering: ",this.iceGatheringState);
}

function on_ice_candidate_error(err){
	console.error('ice candidate err: ', err);
	}

 function on_negotiation_needed(){
	console.warn("ON NEGOTIATION NEEDED!");
	}
	
function signaling_state_change(){
	console.log('signaling state: ',this.signalingState);
	}

function on_connection_state_change(){
console.log('connection state: ', this.connectionState);
if(this.connectionState == "disconnected"){
STOP_PRIVAT();
stopVideo();
if(owner()){
	SEND_UNPRIVAT();
}else{
v.className = "notowner";	
}

if(!owner()){
if(buser()){
	if(NOT_GRATIS_TIMER){clearTimeout(NOT_GRATIS_TIMER);}
}
}
}else if(this.connectionState == "failed"){
stopPrivat.disabled = true;
IS_PRIVAT = false;
IS_GRATIS = true;
}else if(this.connectionState == "connecting"){
v.className = "connecting";
}else if(this.connectionState == "connected"){
		BEGIN_PRIVAT();
		console.log("IS_GRATIS: ", IS_GRATIS);
		v.className = "";
		if(!owner()){
		if(!IS_PRIVAT){}	
		}
		if(!IS_GRATIS){gavno_ticker();}
		if(owner()){
		let d = {};
		d.type = 'privat';
	    d.id = modelId.value;
	    d.modelname = modelName.value;
	    d.from = myusername;
	    wsend(d);
	}	
	}
}

 function handle_offer(sdp, target){
pc = createPeer();
pc.setRemoteDescription(sdp).then(function(){
return navigator.mediaDevices.getUserMedia({video:true,audio:true})}).then(function(stream){
console.log('stream:', stream);
localVideo.srcObject = stream;
is_webcam = true;
stream.getTracks().forEach(function(track){pc.addTrack(track, stream)})
}).then(function(){
return pc.createAnswer();
}).then(function(answer){
return pc.setLocalDescription(answer);	
}).then(function(){
wsend({type: "answer", "answer": pc.localDescription, "from": myusername, "target": target});
}).catch(function(e){
console.log(e);
webrtc.innerHTML+= e + '<br>';		
})
}

function handle_answer(sdp){
console.log("answer came");
console.log("PC: ", pc);
pc.setRemoteDescription(sdp);	
}

function stop_failure(obj){
//for non owner?
stopVideo();	
let s = (yourLang.value == "ru" ? 'Извините,\t' + obj.who + '\tоффлайн.' : 'Sorry,\t' + obj.who + '\toffline.');
note({content: s, type: 'error', time: 5});
}

function stopVideo(){
console.log('stop video');
if(remoteVideo.srcObject){
remoteVideo.srcObject.getTracks().forEach(function(track){track.stop();
})
remoteVideo.srcObjetc = null;
}
if(localVideo.srcObject){
localVideo.srcObject.getTracks().forEach(function(track){track.stop();
	})
localVideo.srcObject = null;
}
console.log("For timer IS_PRIVAT: ", IS_PRIVAT)
IS_PRIVAT = false;
clearTimeout(NOT_GRATIS_TIMER);
if(!pc){console.log('no pc');return;}
clearPeer();
}

function clearPeer(){
	clearTimeout(NOT_GRATIS_TIMER);
console.log('pc: ', pc.signalingState);
pc.close();
pc.onicecandidate = null;
pc.oniceconnectionstatechange = null;
pc.onicegatheringstatechange = null;
pc.onicecandidaterror = null;
pc.onnegotiationneeded = null;
pc.signalingstatechange = null;
pc.onconnectionstatechange = null;
pc.on_track = null;
btnStart.disabled=false;
pc.oniceconnectionstatechange = null;
pc.onicegatheringstatechange = null;
pc.onicecandidaterror = null;
pc.onnegotiationneeded = null;
pc.signalingstatechange = null;
pc.onconnectionstatechange=null;
pc.on_track = null;
pc = null;
console.log('pc: ',pc);
if(owner()){
v.className = "owner";
}else{
v.className = "notowner"
}
btnStart.disabled = false;
}

localVideo.onerror = function(e){
	console.error('err: ',e);
	}
remoteVideo.onerror = function(e){
	console.error('err: ', e);
		if(!owner()){
		v.className="streaminterupt";
		}
	}
