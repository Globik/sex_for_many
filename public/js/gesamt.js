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
var tbod=document.getElementById("tbod");
var row=tbod.insertRow(0);
row.setAttribute('data-roomid', ajson.room_id);
//console.log(row);

row.innerHTML='<td><figure><img width="80px" height="60px" src="'+ajson.src+'">'+
'<figcaption><a href="/webrtc/"'+ajson.room_id+'>'+ajson.nick+'</a></figcaption></figure>'+
'</td><td>'+ajson.roomdesc+'</td><td class="views" data-room="'+ajson.room_id+'">'+ajson.v+'</td>';

	
}else if(ajson.typ=="outair"){
var seli=document.querySelector('[data-roomid="'+ajson.roomid+'"]');
try{	
if(seli)seli.remove();
}catch(e){}
}else if(ajson.typ=="viewers"){
console.log('typ viewers',ajson);
var baba=document.querySelector('[data-room="'+ajson.room_id+'"]');
if(baba)baba.textContent=ajson.viewers;
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


