var si = 0, sendto = true;

function go_login(ev){
	//login
	try{
let data = {};
data.username = ev.username.value;
data.password = ev.password.value;
vax(ev.method, ev.action, data, on_login, on_login_error, ev, false);
ev.disabled = true;
ev.lsubmit.className = "puls";	
}catch(e){alert(e);console.log(e);}
}
function on_login(l, ev){
	ev.lsubmit.className = "";
var sessRed = gid('sessRed');
if_cont(sessRed,'green', 'red');

sessRed.innerHTML = l.info;
window.location.href = "#.";
in_rem_hash();
setTimeout(function(){
if(window.location.pathname == "/login"){
window.location.href = "/";	
}else{
location.reload();
}
},1);
}
function on_login_error(l, ev){
	ev.lsubmit.className = "";
	ev.disabled = false;
gid("sessRed").innerHTML =  l;
}


function get_login(el){
//var el=document.querySelector("section.tabactive");
//if(!el)return;
//el.className="";
var signupSection = gid("signupSection");
if(!signupSection){window.location.href = "/login";return;}
signupSection.className = '';
signupSection.style.display = "none";
loginSection.style.display = "block"
loginSection.className = "tabactive";
if(el)el.className = "yellow";
vout.className = "";
var a = gid("resetSection");
	a.style.display = "none";
	a.className = "";
}
function get_registr(el){
//var el=document.querySelector("section.tabactive");
//alert(el);
//if(el)el.className="";
var signupSection = gid("signupSection")	
loginSection.className = '';
loginSection.style.display = "none";
signupSection.className = "tabactive";
signupSection.style.display = "block";
el.className = "yellow";
vhod.className = "";
var a = gid("resetSection");
	a.style.display = "none";
	a.className = "none";
}

function show_pwd(el){
if(password.value){
if(password.type == "password"){
password.type = "text";
}else{password.type = "password"}
}
}
function get_forget(){
let a = gid("resetSection");
if(!a){window.location.href = "/reset";return;}
	a.style.display = "block";
	a.className = "tabactive";
loginSection.className = '';
loginSection.style.display = "none";
signupSection.className = "";
signupSection.style.display = "none";
}
function go_login2(el){
//registration
try{
let d = {};
d.username = el.username.value;
d.password = el.password.value;
d.email = el.email.value;
d.lang = el.lang.value;
d.promocode = el.promocode.value;
console.log('d: ',d)
vax(el.method, el.action, d, on_glogin, on_glogin_error, el,false);	
el.disabled = true;
el.ssubmit.className = "puls";
return false;
}catch(e){}
return false;
}

function on_glogin(l, ev){
try{
	ev.ssubmit.className = "";
console.log(l);
if(!l.success){
let s=gid("sessRed2").textContent = l.message;
}else{
gid("sessRed2").textContent = l.message;
gid("submitkuku").disabled = true;
window.location.href = "#.";
in_rem_hash();

setTimeout(function(){
if(window.location.pathname == "/signup"){
window.location.href = "/webrtc/" + l.user_id;	
}else{
location.reload();
}
}, 1000);
}
}catch(e){alert(e)}
}
function on_glogin_error(l, ev){
console.log("l");
ev.ssubmit.className = "";	
gid("sessRed2").textContent = l.message;
ev.disabled = false;
}
function do_sub(el){
//views/reset_proto.js
try{
let d={};
d.email=el.email.value;
vax(el.method, el.action, d, on_do_sub, on_do_sub_error, el,false);
el.className="puls";
return false;
}catch(e){alert(e);console.log(e);return false;}
return false;
}

function on_do_sub(l, el){
console.log(l);
el.className="";
sessRed3.innerHTML=l.info
}
function on_do_sub_error(l, el){
console.error(l);
el.className="";
sessRed3.innerHTML=l;
}

/*
 
function go_login(ev){
	try{
//var submit=cl('login-submit');

var sessRed=gid('sessRed');
si++;
var xhr=new XMLHttpRequest();
xhr.open(ev.method, ev.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
//if(if_cont(submit,'no','waiting'));
if(xhr.status==200){
//submit.disabled=true;
add_st(true);
if_cont(sessRed,'green','red');
var mata=JSON.parse(this.response);
sessRed.innerHTML=mata.info;
window.location.href="#.";//mata.redirect;
in_rem_hash();
setTimeout(function(){location.reload();},0);
}else{
if_cont(sessRed,'red','green');
sessRed.innerHTML=this.response;
add_st(false);
}}
xhr.onerror=function(e){console.error('XHR onerror: '+e);sessRed.innerHTML='Internet connection lost.';}
var data={};
data.username=ev.username.value;
data.password=ev.password.value;
var mid=JSON.stringify(data);
if(window.sessionStorage){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
if(sessionStorage.count > 15){
if_cont(sessRed,'red','green');
sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";

try{xhr_failed_login(ev);}catch(e){alert(e);console.log(e)}
setTimeout(go_wieder, 5000);
sendto=false;
}

function go_wieder(){
console.log('istablished');
sessionStorage.count=1;
sendto=true;
if_cont(sessRed,'green','red');
}
}else{
if(si>4){console.warn('great then 4');sendto=false;}
}
if(sendto){
//if_cont(submit,'waiting','no');
console.log(mid);
xhr.send(mid);
}
}catch(e){alert(e)}
}

function xhr_failed_login(e){
	return;
var xhr=new XMLHttpRequest();
xhr.open('post','/xhr_failed_login');
xhr.onload=function(evi){
if(xhr.status==200){
console.log('from server failed login process: '+this.response);
}else{
console.error(this.response);
}
}
xhr.onerror=function(e){console.error(e);}
if(e.email.value){xhr.send(e.email.value);
}}
function add_st(b){
//var em=cl('login-email');
//var pwd=cl('login-pwd');
if(b){
//if_cont(em,'no','redinput');
//if_cont(pwd,'no','redinput');
}else{
//if_cont(em,'redinput','no');
//if_cont(pwd,'redinput','no');
}}
*/ 
function cl(n){return document.getElementsByClassName(n)[0];}
function if_cont(el,a,b){
if(el.classList.contains(b)){el.classList.remove(b)}
el.classList.add(a);}
