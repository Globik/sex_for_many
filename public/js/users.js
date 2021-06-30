var flagi = false;
var v = gid("usersection");
var Buser = gid("Buser");
var Lang = gid("Lang");

var is_admin = function(){return (Buser.value == "true" ? true : false) }
var is_rus = function(){return (Lang.value == "true" ? true : false)}

function get_more_users(el){
if(flagi){
do_update_query(el);
return;	
}
	
if(!v.lastChild)return;
var b = v.lastChild.getAttribute('data-at');
if(!b)return;
var d = {};
d.next = b;
vax("post", "/api/get_more_users", d, on_get_users, on_get_user_error, el, false);
el.className = "puls";
}
function on_get_users(l,ev){
console.log("content: ",l.content);
ev.className = "";
if(!l.content)return;
formi_user_list(l.content);	
}
function on_get_user_error(l,v){
v.className = "";
note({content: l, type: "error", time: 5})	
}

/*
 * 
 * `<hr> <div class="newuserdiv" data-id="${el.id}" data-at="${el.crat}">
<div>${buser && buser.lng == 'ru' ? 'зарегистрирован' : 'created'}: ${el.crat}</div>
<div class="newuserleft"><img class="newuserfoto" src="${el.ava?el.ava:'/images/default.jpg'}"/></div>
<div class="newuserrite">
<div><a href="/webrtc/${el.id}">${el.bname}</a>
${buser && buser.brole == 'superadmin' ? `<div>${el.email}</div>` : ''}
<div>${buser && buser.lng == 'ru' ? 'последний раз был' : 'last login'}: ${el.ll}</div>
${buser && buser.brole == 'superadmin' ? `<div>items: ${el.items}</div>
<div><button data-id="${el.id}" data-nick="${el.bname}" data-email="${el.email}"
 onclick="send_welcome_mail(this);">welcome on board</button></div>` : ''}
</div></div><hr>`;
*/ 
function formi_user_list(arr){
var frag = document.createDocumentFragment();
arr.forEach(function(el,i){
var newuserdiv = document.createElement("div");
newuserdiv.className = "newuserdiv";
newuserdiv.setAttribute("data-id", el.id);
newuserdiv.setAttribute("data-at", el.crat);
newuserdiv.innerHTML = '<div class="newuserleft"><img class="newuserfoto" src="' + (el.ava ? el.ava : '/images/default.jpg') +
'"></div><div class="newuserrite"><div><a href="/webrtc/' + el.id + '">' + el.bname + '</a>, ' + (el.bage ? el.bage : '18') + ', ' + el.sexor + '</div>' +
(el.stat ? '<div>' + el.stat + '</div>' : '') + '<div>' + (is_rus() ? 'зарегистрирован' : 'created') + ': ' + el.crat + '</div>' +
'<div>' + (is_rus() ? 'последний раз был' : 'last login') + ': ' + el.ll + '</div>' +
(is_admin() ? '<div>email: ' + el.email + '</div><div><button data-id="' + el.id + '" data-email="' + el.email + '" onclick="send_welcome_mail(this);">Welcome on board</button></div>' +
'<div>items: ' + el.items + '</div>' : '') + '</div><hr>';
frag.appendChild(newuserdiv);
});	

v.appendChild(frag);
}

function fetch_all_suchen(el){
vax("post", "/api/fetch_all_suchen", {}, on_fetch_all_suchen, on_fetch_all_suchen_error, el, false);
el.className = "puls";	
}
function remove_nodes(el){
if(!el)return;
if(el.hasChildNodes()){
while(el.hasChildNodes()){
el.removeChild(v.firstChild);	
}	
}
}

function on_fetch_all_suchen(l,el){
el.className = "";
if(!l.result)return;
flagi = false;
remove_nodes(v);
formi_user_list(l.result);
}
function on_fetch_all_suchen_error(l,el){
el.className = "";
note({content: l, type: "error", time: 5});		
}

var zid = document.forms.Z;
zid.addEventListener("submit", on_submit, false);

function on_submit(ev){
ev.preventDefault();
var ab = ev.target.ab.value;
var bis = ev.target.bis.value;
//var city=ev.target.city.value;
var bi = ev.target.bi.value;
var keywort = ev.target.keywort.value;
var d={ab: ab, bis: bis, bi: bi, keywort: keywort};
//alert(JSON.stringify(d));	
vax(ev.target.method, ev.target.action, d, on_get_suchen, on_get_suchen_error, ev.target, false);
ev.target.className = "puls";
}

function on_get_suchen(l,el){
el.className = "";
if(!l.result)return;
if(l.result.length == 0)return;	
flagi=true;
//alert(JSON.stringify(l.result))
remove_nodes(v);
formi_user_list(l.result);
}

function on_get_suchen_error(l, el){
el.className = "";
note({content: l, type: "error", time: 5});	
}
function do_update_query(ev){
var ab = zid.ab.value;
var bis = zid.bis.value;
//var city=zid.city.value;
var bi = zid.bi.value;
var keywort = zid.keywort.value;
if(!v.lastChild)return;
var b=v.lastChild.getAttribute('data-at');
if(!b)return;
var d={ab: ab, bis: bis, bi: bi, keywort: keywort, next: b};
//alert(JSON.stringify(d));	
vax("post", "/api/update_query", d, on_update_query, on_update_query_error, ev, false);
ev.className = "puls";
}
function on_update_query(l,el){
el.className = "";
if(!l.result)return;
if(l.result.length == 0)return;
remove_nodes(v);
formi_user_list(l.result);	
}
function on_update_query_error(l,el){
el.className = "";
note({content: l, type: "error", time: 5});	
}

function send_welcome_mail(el){
	let d={};
	d.email=el.getAttribute('data-email');
	d.id=el.getAttribute('data-id');
	d.nick=el.getAttribute('data-nick');
	vax("post", "/send_welcome", d, on_send_welcome, on_send_welcome_err, el, false);
	el.className="puls";
	}
	
	function on_send_welcome(l,ev){
		ev.className="";
		note({content:l.info,type:"info",time:5});
		}
	function on_send_welcome_err(l,ev){
		note({conntent:l,type:"error",time:5});
		ev.className="";
		}
