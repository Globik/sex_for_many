var flagi=false;
var v=gid("usersection");

function get_more_users(el){
if(flagi){
do_update_query(el);
return;	
}
//var v=gid("usersection");	
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

v.appendChild(frag);
}

function fetch_all_suchen(el){
vax("post", "/api/fetch_all_suchen", {}, on_fetch_all_suchen, on_fetch_all_suchen_error, el, false);
el.className="puls";	
}

function on_fetch_all_suchen(l,el){
el.className="";
if(!l.result)return;
flagi=false;

if(v.hasChildNodes()){
while(v.hasChildNodes()){
v.removeChild(v.firstChild);	
}	
}
formi_user_list(l.result);
}
function on_fetch_all_suchen_error(l,el){
el.className="";
note({content: l, type: "error", time: 5});		
}

var zid=document.forms.Z;
zid.addEventListener("submit", on_submit, false);

function on_submit(ev){
ev.preventDefault();
var ab=ev.target.ab.value;
var bis=ev.target.bis.value;
var city=ev.target.city.value;
var bi=ev.target.bi.value;
var keywort=ev.target.keywort.value;
var d={ab:ab,bis:bis,city:city,bi:bi,keywort:keywort};
//alert(JSON.stringify(d));	
vax(ev.target.method, ev.target.action, d, on_get_suchen, on_get_suchen_error, ev.target, false);
ev.target.className="puls";
}

function on_get_suchen(l,el){
el.className="";
if(!l.result)return;
if(l.result.length==0)return;	
flagi=true;
//alert(JSON.stringify(l.result))
if(v.hasChildNodes()){
while(v.hasChildNodes()){
v.removeChild(v.firstChild);	
}	
}
formi_user_list(l.result);
}

function on_get_suchen_error(l,el){
el.className="";
note({content: l, type: "error", time: 5});	
}
function do_update_query(ev){
var ab=zid.ab.value;
var bis=zid.bis.value;
var city=zid.city.value;
var bi=zid.bi.value;
var keywort=zid.keywort.value;
if(!v.lastChild)return;
var b=v.lastChild.getAttribute('data-at');
if(!b)return;
var d={ab:ab,bis:bis,city:city,bi:bi,keywort:keywort, next:b};
//alert(JSON.stringify(d));	
vax("post", "/api/update_query", d, on_update_query, on_update_query_error, ev, false);
ev.className="puls";
}
function on_update_query(l,el){
el.className="";
if(!l.result)return;
if(l.result.length==0)return;
if(v.hasChildNodes()){
while(v.hasChildNodes()){
v.removeChild(v.firstChild);	
}	
}
formi_user_list(l.result);	
}
function on_update_query_error(l,el){
el.className="";
note({content:l,type:"error",time:5});	
}
