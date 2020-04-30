function get_more_users(el){
var v=gid("usersection");	
if(!v.lastChild)return;
var b=v.lastChild.getAttribute('data-at');
if(!b)return;
var d={};
d.next=b;
vax("post", "/api/get_more_users", d, on_get_users, on_get_user_error, el, false);
el.className="puls";
}
function on_get_users(l,ev){
console.log("content: ",l.content);
ev.className="";
if(!l.content)return;
formi_user_list(l.content);	
}
function on_get_user_error(l,v){
v.className="";
note({content:l,type:"error",time:5})	
}
function formi_user_list(arr){
var frag=document.createDocumentFragment();
arr.forEach(function(el,i){
var newuserdiv=document.createElement("div");
newuserdiv.className="newuserdiv";
newuserdiv.setAttribute("data-id", el.id);
newuserdiv.setAttribute("data-at", el.crat);
newuserdiv.innerHTML='<div class="newuserleft"><img class="newuserfoto" src="'+(el.ava?el.ava:'/images/default.jpg')+
'"></div><div class="newuserrite"><div><a href="/webrtc/'+el.id+'">'+el.bname+', '+(el.age?el.age:'18')+'</a></div>'+
(el.bi?'<div>'+el.bi+'</div>':'')+(el.city?'<div>'+el.city+'</div>':'')+
(el.msg?'<div>'+el.msg+'</div>':'')+'</div>';
frag.appendChild(newuserdiv);
});	
var v=gid("usersection");	
v.appendChild(frag);
}
