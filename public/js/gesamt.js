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
var table=document.createElement('table');
table.setAttribute('data-roomid',ajson.roomid);
table.innerHTML='<tr><th class="suka">name</th><th>status</th><th>viewers</th></tr><tr><td class="duka">'+
'<figure><img src="'+ajson.src+'" width="80px" height="60px"/>'+
'<figcaption><a href="/webrtc/'+ajson.roomid+'">'+ajson.nick+'</a></figcaption>'+
'</figure></td><td>'+ajson.roomdesc+'</td><td class="views">'+ajson.v+'</td></tr>';
imgContainer.appendChild(table);

	
	
}else if(ajson.typ=="outair"){
var seli=document.querySelector('[data-roomid="'+ajson.roomid+'"]');
try{	
if(seli)seli.remove();
}catch(e){}
}
}

/*

`<table data-roomid="${el.room_id}" title="${el.descr}">
<tr><th>name</th><th>status</th><th>viewers</th></tr>
<tr><td class="duka">
<figure>${el.src ? `<img src="${el.src}" width="80px" height="60px"/>`:''}
<figcaption><a href="/webrtc/${el.room_id}">${el.nick}</a></figcaption>
</figure></td><td>${el.descr}</td><td class="views">${el.v}</td></table>
`;*/


