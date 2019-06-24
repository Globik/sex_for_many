var sock=null;
function get_socket(){
sock=new WebSocket("ws://localhost:3000/gesamt");

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
if(ajson.typ=="atair"){
var  emg=document.createElement('img');
var nochdiv=document.createElement('div');
	emg.src=ajson.src;
	nochdiv.appendChild(emg);
	nochdiv.className="nochdiv";
	nochdiv.setAttribute("data-roomid", ajson.roomid);
	nochdiv.setAttribute("title",ajson.roomdesc);
	imgContainer.appendChild(nochdiv);
}else if(ajson.typ=="outair"){
var seli=document.querySelector('[data-roomid="'+ajson.roomid+'"]');	
if(seli)seli.remove();
}
}
