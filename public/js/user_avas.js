var tel=89634623542;

function outi(s){
	outi.innerHTML+=s+'<br>';
	}
//name gru5@yandex.ru
//sip acc 21201603073020
//vG7fKPxy 65988.voice.plusofon.ru
//var socket=new JsSIP.WebSocketInterface('wss://65988.voice.plusofon.ru');
var socket=new WebSocket('ws://sip.zadarma.com');
socket.onopen=function(){console.log('open');}
socket.onclose=function(){console.log('close');}
socket.onerror=function(e){console.error('err: ',e)}
//ssh root@91.217.80.183
//var socket=new JsSIP.WebSocketInterface('wss://sip.plusofon.ru');
//socket.origin='https://websocket.org';
//socon('connected',function(){console.warn('connected');})
//socket.via_transport='udp';
//socket.connect();
var config={
	sockets:[socket],
	uri:'21201603073020@65988.voice.plusofon.ru:5060',
	password:'vG7fKPxy',register:false,registrar_server:'sip:registrar.plusofon.ru'
	};
/*var ua=new JsSIP.UA(config);
function begin_was(){
ua.start();
}
//socket.on('error',function(e){console.error(e);})
ua.on('connected',function(e){outi('connected.');console.log('connected');});
ua.on('disconnected',function(e){outi('disconnected.');console.log('disconnected');});
ua.on('newMessage',function(e){outi('newMessage.');});
ua.on('newRTCSession',function(data){
var originator=data.originator;
var sessi=data.session;
var req=data.request;
outi('<b>NewRTCSession. originator: </b>'+originator);
outi('<b>session: </b>'+sessi);
outi('<b>request: </b>'+req);
//this.stop();	
})
ua.on('registered',function(e){outi('registred.');})
ua.on('unregistered',function(e){outi('unregistred.');})
ua.on('registrationFailed',function(e){outi('reqistrationFailed.');});
*/




function check_ava(el){
if(el.checked){
var f=el.getAttribute("data-fname");
if(!f)return;
var d={};
d.fname=f;
vax('post','/api/ava-checked',d,on_check_ava,on_check_ava_err,null,false);	
}	
}
function on_check_ava(l){
console.log(l);
var f2=document.querySelector('[data-pname="'+l.info+'"]');
if(f2)f2.remove();	
note({content: l.info+" одобрено!", type:"info", time: 5});
}
function on_check_ava_err(l){
console.error(l);
alert(l);
}
function delete_ava(el){
let l=el.getAttribute('data-dname');
//alert(l);
if(l){
var d={};
d.fname=l;
vax('post','/api/ava-delete', d, on_del_ava, on_check_ava_err,null,false);	
}	
}
function on_del_ava(l){
console.log(l);
var f2=document.querySelector('[data-pname="'+l.info+'"]');
if(f2)f2.remove();	
note({content: "Удалено!", type:"info", time: 5});
}
