//html_nav_menu.js
const html_nav_menu=n=>{
return `<!-- header_menu.js -->
<label class="label-login">${n.buser?'<a href="/logout">выход</a>':'<a href="/login">вход</a>'}</label>
<ul id="menu">
<li><a href="/"><div class="mnav">home</div></a>
</ul>
<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>

<ul id="miniMenu" class="">
<li><a href="/"><div class="muka"><span>На главную</span></div></a>
<li><a href="/home/blog"><div class="muka"><span>блог</span></div></a>
<li><a href="/home/obi"><div class="muka"><span>Доска объявлений</span></div></a>
${n.buser?`<li><a href="/home/profile/${n.buser.bname}"><div class="muka"><span>профиль</span></div></a>`:''}
${n.buser?`<li><a href="/webrtc/${n.buser.id}"><div class="muka"><span>Видеочат</span></div></a>`:''}
${n.buser?'<li><a href="/logout" id="login_pop"><div class="muka"><span>выйти</span></div></a>':
'<li><a href="/login"><div class="muka"><span>войти</span></div></a>'}
<!-- <li><a href="/signup"><div class="muka"><span>sign up</span></div></a> -->
</ul>

<a href="#." class="overlay" id="message_box"></a>
<output id="out_box" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="inbox"></div>
</output>
<dialog  id="dialogConfirm">
<div id="inbox3"></div>
<form id="dialogForm" method="dialog" style="display:nne;">
<button id="dialogCancelbtn" type="reset" onclick="dialogConfirm.close();">cancel</button>
<button type="submit" value="true">yes</button><button type="submit" value="false">no</button>
</form>
</dialog>
<output class="alert" id="alert_id">
<div id="inbox2"></div>
</output>
<script>
var duri=gid("duri"),
//elmini=gid("operamini-menu-selector"),
minmen=gid('miniMenu'),
lb=gid('lb-menu-all'),dsel=document.querySelectorAll('label .spinner');
var mainP=gid('enc');
var gr=true;
function dowas1(){
if(gr){
minmen.style.display="block";
minmen.style.zIndex="2";
//lb.classList.add('active');
gad(dsel,'active');
gr=false;
}else{
minmen.style.display="none";
minmen.style.zIndex="0";
//lb.classList.remove('active');
sumor(dsel,'active');
gr=true;}
}
document.body.onload=shalter;

function shalter(){
gid('pagewrap').onclick=clickshalter;
gid('pagewrap').ontouch=clickshalter;
var dlg=gid('dialogConfirm');
if(flexsupport==false){if(dlg) dlg.style.display="none";}
function clickshalter(e){
	minmen.style.display="none";
	//lb.classList.remove("active");
	sumor(dsel,'active');
//console.log('clicked!');
gr=true;
}}
/*
var isOperaMini = (navigator.userAgent.indexOf('Opera Mini')>-1);
if(isOperaMini){
duri.style.display="none";
elmini.style.display="block";}
*/
function sumor(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.remove(clas);
}
}
function gad(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.add(clas);
}
}

</script><!-- end of html_nav_menu.js -->`;}
module.exports={html_nav_menu};
