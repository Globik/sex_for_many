// sex_for_many
'use strict';
function is_local_storage(){return (typeof(Storage) !=='undefined'?true:false);}
function is_dialogi(){return (typeof HTMLDialogElement==='function'?true:false);}
function bzuka(el,n,ml){
gid('inbox3').innerHTML='<b>'+n+'</b>';
dialogConfirm.showModal();
dialogConfirm.onclose=function(ev){
ev.target.returnValue=='true'?luzda(el,ml):null;
ev.target.returnValue=null;
}}
function shell(el,n,ml){is_dialogi()?bzuka(el,n,ml):puzuki(el,n,ml);}
function puzuki(el,n,ml){confirm(n)?luzda(el,ml):null}
function luzda(el,ml){(el?el.target.dispatchEvent(ml):pizda(ml));}
function galert(n){
var c=window.getComputedStyle(document.querySelector('.popi'),null).getPropertyValue('z-index');
inbox2.innerHTML='<b>'+n+'</b>';
if(c)gid('alert_id').style.zIndex=c+1;
gid('alert_id').classList.add('ak');
setTimeout(function(){
gid('alert_id').classList.remove('ak');
},5000)
}
function open_al(){
gid('message_box').onclick=function(e){
in_rem_hash();
}}
function in_rem_hash(){setTimeout(function(){rem_hash();},0);}
function rem_hash(){
if(history)history.pushState('',null,window.location.pathname);}
function message_box(n){
console.log('mess: ',n)
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
open_al();
}
function vax(m,u,d,o,z,pointer,bool){
var x=new XMLHttpRequest();if(!x){return;}x.open(m,u);
x.setRequestHeader('Cache-Control','no-cache');
if(!bool){console.log('json');x.setRequestHeader('Content-Type','application/json','utf-8');}x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload=function(e){
x.status==200?o(demiss(this.response || this.responseText),pointer):z(this.response || this.responseText,pointer)};
x.onerror=function(e){alert(e)};
if(!bool){var v=miss(d);console.log('sending json');x.send(v);}else{x.send(d)}}

function miss(n){var a;try{a=JSON.stringify(n);return a;}catch(er){throw er;}}
function demiss(n){var b;try{b=JSON.parse(n);return b;}catch(er){return n;}}
function create_event(name){
var makaka23=null;
try{
makaka23=new Event(name);return makaka23;
}catch(e){
makaka23=document.createEvent('Event');
makaka23.initEvent(name,true,true);
return makaka23;
}
return makaka23;
}
function gid(id){return document.getElementById(id);}
function supportFormData(){return !! window.FormData;}
function crel(tagname,text,className){var eli=document.createElement(tagname);eli.textContent=text;eli.className=className;return eli;}
function insert_after(newnode, refnode,tagname){
try{
del_after(refnode, tagname);
refnode.parentNode.insertBefore(newnode,refnode.nextSibling);
}catch(e){console.log(e);}
}
function del_after(refnode, tagname){
if(!refnode.nextSibling)return;
if(refnode.nextSibling.tagName==tagname.toUpperCase())refnode.parentNode.removeChild(refnode.nextSibling);	
}
