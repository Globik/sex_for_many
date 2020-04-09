const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const doska=require('./doska');
const {get_banner, get_banner_podval}=require('./reklama_s');
var warnig=false;

const main_page=function(n){
const {lusers}=n;
const buser=n.user,roomers=n.roomers;

return `<!DOCTYPE html><html lang="en">
<head>${html_head.html_head({title:"Текстовый и видео чат для гей-сообщества", meta:get_meta(),csslink:"/css/main2.css",cssl:["/css/main_page.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap">
${n.m?n.m.msg:''}<br>
${buser?`Привет <a href="/webrtc/${buser.id}">${buser.bname}</a>!`:'Привет, гость!'}<br>
<h1>Добро пожаловать в гей сообщество!</h1>
<p>
Ищешь <b>знакомства с парнями</b>? Устал от одиночества? Тогда ты по адресу!
</p>
<p>
У нас есть чат - <b>видеочат</b>! После быстрой регистрации ты можешь создать свою <b>чат-комнату</b>, в которую можно
приглашать своих подписчиков из социальных сетей, чтобы пообщаться на интимные темы как приватно, так и публично.
Обменяться сексуальными фотками.</p>

<p>Оставаясь с нами, у тебя есть шанс получать <b>биткоины</b> на свой <b>криптокошелек</b> от поклонников твоей красоты.
Просто не забудь перед чатом заполнить поле с реквизитами своего <b>биткоин адреса</b>.</p>

<p>Вероятность найти идеального партнера резко вырастет, если ты заполнишь <b>анкету</b> в своем профиле.</p>

<p>Также обрати внимание на нашу <b>гей-доску</b>. Парни из всех уголков нашей страны жаждут вступить в контакт с потенциальным партнером и
оставляют свои объявления на гей-доске совершенно <b>бесплатно</b> и <b>без регистрации</b>.
 Ты можешь тоже написать свое объявление!</p>

<p>Итак, готов выбрать <b>чат-комнату</b> или создать свою? Тогда за дело! И приятного общения!</p>
<hr>
<section id="onlineSection">
<header id="onlineHeader">Чат-комнаты.</header>
<section id="onlineContainer">
${lusers && lusers.length >0 ? roomers_list(lusers) : 
`<span id="zagln">Пока нет никого. <a class="ahero" href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
</section>
</section>
<hr>
${doska.doska({})}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</main>
<input type="hidden" id="buserli" value="${buser?buser.id:0}">
<script src="/js/gesamt.js"></script>
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports={main_page};

function roomers_list(n){
let s='';
if(Array.isArray(n)){
 n.forEach(function(el,i){
s+=`<div data-roomid="${el.us_id}" class="img-online-container">
<img class="img-online" src="${el.ava?(el.isava==2?el.ava:'/images/default.jpg'):'/images/default.jpg'}">
<footer class="img-footer"><a href="/webrtc/${el.us_id}">${el.nick}</a>&nbsp;,&nbsp;${el.age?el.age:18}&nbsp;лет.&nbsp;
(<span data-vid="${el.us_id}">${el.v}</span> чел.)</footer>
</div>`;
});
 }
return s;
}
/*
<section id="onlineSection">
<header id="onlineHeader">Чат-комнаты.</header>
<section id="onlineContainer">
<div data-roomid="5" class="img-online-container">
<img class="img-online" src="../public/images/default.jpg">
<footer class="img-footer"><a href="/webrtc/1">Globi</a>&nbsp;, 18 лет.</footer>
</div>
</section>
</section>
*/
function get_meta(){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="Текстовый и видео чат для гей-сообщества"/>
<meta property="og:description" content="Анонимный секс чат для текстового, голосового или
по вебкамере общения и знакомств, как для виртуального, так и реального секса. 
Получение донатов в биткоинах от заинтересованных пользователей"/>

<meta property="og:site_name" content="gayroom"/>
<meta itemprop="name" content="Текстовый и видео чат для гей-сообщества"/>
<meta itemprop="description" content="Анонимный секс чат для текстового, голосового или
по вебкамере общения и знакомств, как для виртуального, так и реального секса. 
Получение донатов в биткоинах от заинтересованных пользователей"/>`
return s;
//<meta property="og:image" content="http://alikon.herokuapp.com/images/bona.png"/>
//<meta property="og:url" content="http://alikon.herokuapp.com"/>
	
	
}

