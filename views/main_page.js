const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const vert_menu=require('./vert_menu.js');
const doska=require('./doska');
const {people} = require('./people');
const {get_banner, get_banner_podval}=require('./reklama_s');

const main_page=function(n){
const {lusers}=n;
const buser=n.user,roomers=n.roomers;

return `<!DOCTYPE html><html lang="en"><!-- main_page.js -->
<head>${html_head.html_head({title:"Сервис видеостримов для взрослых.", meta:get_meta(n.meta),
csslink:"/css/main2.css",cssl:["/css/main_page.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
<script>
function check_age(){
if(is_local_storage()){
if(localStorage.getItem('age')==1){
return;
}
}
if(is_dialogi()){
dialogConfirm2.showModal();
dialogConfirm2.onclose=function(ev){
//alert(ev.target.returnValue);
ev.target.returnValue=='true'?gsiska():gpiska();
function gsiska(){set_yes();}
function gpiska(){say_no();}
}
}else{
window.location.href="#message_box2";
var qtar=document.querySelector('.overlay:target');
if(qtar){
qtar.onclick=function(){in_rem_hash();}
}
}
}

check_age();

function say_yes(){
window.location.href="#";
in_rem_hash();
set_yes();
}
function say_no(){
window.location.href="https://www.yandex.ru";
}
function set_yes(){
if(is_local_storage()){
localStorage.setItem('age',1);
}
}
</script>
${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
${n.m?n.m.msg:''}
<div id="privet">${buser?`Привет <a href="/webrtc/${buser.id}">${buser.bname}</a>!`:'Привет, гость!'}</div>
<article id="mainArticle"><h1>Добро пожаловать на сайт видеотрансляций!</h1>
<p>После простой регистрации вы сможете:
<ul id="ulKomnata">
<li><strong>стримить видео</strong>
<li>получать от юзеров <strong>чаевые в биткоинах</strong> и <strong>токенaх</strong>
</ul>
</p>
<p>
Также обратите внимание на <strong>доску объявлений для знакомств</strong>.
 Без регистрации и совершенно бесплатно в ней можно разместить свое объявление</p>
<p> ${!buser?' &nbsp;<button class="regabutton"><a class="rega" href="/signup">Начать видеотрансляцию</a></button>':` &nbsp;<button class="regabutton"><a class="rega" href="/webrtc/${buser.id}">Перейти к видеотрансляции</a></button>`}</p></article>
<hr>
<section id="onlineVideo">
<header id="onlineVideoHeader">Живое видео</header>
<section id="videoContainer">
${n.videoUsers && n.videoUsers.length > 0 ? vroomers_list(n.videoUsers) : 
`<span id="zagln2">Пока нет никого. <a class="ahero" href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
</section>
</section>
<!--
<hr>
<section id="onlineSection">
<header id="onlineHeader">Чат-комнаты.</header>
<section id="onlineContainer">
${lusers && lusers.length >0 ? roomers_list(lusers) : 
`<span id="zagln">Пока нет никого. <a class="ahero" href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
</section>
</section>
-->
<!-- <hr>
<section id="videoSection">
<h3>Свежие видео</h3>
<section id="VidContainer">
${n.videos?`{get_videos(n.videos)}<div><a href="/videos">Смотреть все видео</a></div>`:'Пока нет видео.'}
</section></section> -->
<!-- <hr>
<section id="newUserSection">
<h2>Новые профили</h2>
{n.new_users?get_new_users_list(n.new_users):'Пока нет никого.'}
</section>
-->

<hr>
${doska.doska({})}
${buser && buser.brole=='superadmin'? `<hr>${people({})}`:''}
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</div></main>
<input type="hidden" id="buserli" value="${buser?buser.id:0}">
<script src="/js/gesamt.js"></script>

<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}

module.exports={main_page};

function roomers_list(n){
let s='';
if(Array.isArray(n)){
 n.forEach(function(el,i){
s+=`<div data-roomid="${el.us_id}" сlass="img-online-container">
<img class="img-online" src="${el.ava?el.ava:'/images/default.jpg'}">
<footer class="img-footer"><a href="/webrtc/${el.us_id}">${el.nick}</a>&nbsp;,&nbsp;${el.age?el.age:18}&nbsp;лет.&nbsp;
(<span data-vid="${el.us_id}">${el.v}</span> чел.)</footer>
</div>`;
});
 }
return s;
}
function vroomers_list(n){
let s='';
n.forEach(function(el,i){
s+=`<div data-roomidi="${el.us_id}" class="vroomers" itemscop itemtype="http://schema.org/VideoObject">
<a href="/webrtc/${el.us_id}" itemprop="url">
<header itemprop="name">${el.nick}</header></a>
<p itemprop="description">${el.descr?(el.descr).substring(0,52):"I'm online :)"}</p>
<meta itemprop="duration" content="PT6M58S">
<meta itemprop="isFamilyFriendly" content="false">
<span itemprop="uploadDate">2020-06-05T00:00:00</span><br>
<span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject">
<img itemprop="contentUrl" class="videovroomers" src="${el.typ=='fake'?'/vid/'+el.p:el.p}" data-vidi="${el.us_id}">
<meta itemprop="width" content="250">
<meta itemprop="height" content="120"></span>
<header class="untervideo"><span class="timecl" data-min_time="${el.us_id}">${el.typ=='fake'?get_min():get_mini(el.crat).t}</span>&nbsp;<span class="timecl" data-min_str="${el.us_id}">${el.typ=='fake'?'мин':get_mini(el.crat).s}</span>,&nbsp;
<span class="timecl" data-v_str="${el.us_id}">${el.typ=='fake'?gruss():el.v}</span>&nbsp;<span class="timecl">зрителей</span></header>
</div>`;	
})	
return s;
}
function gruss(){
return Math.floor(Math.random()*(1000-80+1))+80;	
}
function get_min(){
	return Math.floor(Math.random()*(60-10+1))+10;
}
function get_mini(crat){
let a=new Date(crat).getTime();
let b=new Date().getTime();
let d=(b-a)/60000;
let c=Math.round(d);
if(c>=60){
console.log((c/60).toFixed(2),' hours');
return {t:(c/60).toFixed(2), s:'ч'}
}else{
console.log(c, ' min')
return {t: (c==0?1:c), s: 'мин'}	
}	
}

function get_new_users_list(n){
let s='';
n.forEach(function(el,i){
s+=`<div class="newuserdiv">
<div class="newuserleft"><img class="newuserfoto" src="${el.ava?el.ava:'/images/default.jpg'}"/></div>
<div class="newuserrite">
<div><a href="/webrtc/${el.id}">${el.bname}</a> ${el.age?el.age:18} лет.</div>
${el.bi?`<div>${el.bi}</div>`:''}
${el.city?`<div>${el.city}</div>`:''}
${el.msg?`<div>${el.msg}</div>`:''}
</div></div>`;	
})
s+='<div><br><a id="newusera" href="/home/users">Смотреть все профили</a></div>';
return s;	
}
function get_videos(n){
	let s='';
	n.forEach(function(el,i){
	s+=`<div class="videodiv" data-vvid="${el.id}">
	<video data-video_id="${el.id}" src="/vid/${el.src}" preload="metadata" controls onplay="vplay(this);"></video></div>`;	
	})
	return s;
}

function get_meta(n){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="${n.main_page.title}" />
<meta property="og:url" content="${n.url}" />
<meta property="og:image" content="${n.image}" />
<meta property="og:description" content="${n.main_page.description}" />

<meta property="og:site_name" content="globikon" />
<meta itemprop="name" content="${n.main_page.title}" />
<meta itemprop="description" content="${n.main_page.description}" />`
return s;
}
