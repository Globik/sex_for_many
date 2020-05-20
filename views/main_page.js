const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const doska=require('./doska');
const {people} = require('./people');
const {get_banner, get_banner_podval}=require('./reklama_s');
var warnig=false;

const main_page=function(n){
const {lusers}=n;
const buser=n.user,roomers=n.roomers;

return `<!DOCTYPE html><html lang="en"><!-- main_page.js -->
<head>${html_head.html_head({title:"Мультичат для ЛГБТ сообщества России", meta:get_meta(),csslink:"/css/main2.css",cssl:["/css/main_page.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap">
${n.m?n.m.msg:''}<br>
${buser?`Привет <a href="/webrtc/${buser.id}">${buser.bname}</a>!`:'Привет, гость!'}<br>
<h1>Добро пожаловать в мультичат для ЛГБТ сообщества России!</h1>
<p>После быстрой регистрации вы можете:
<ul id="ulKomnata">
<li>создать личную <strong>чат-комнату</strong>
<li>получать от юзеров <strong>чаевые в биткоинах</strong>
<li>принимать <strong>входящие видеозвонки</strong>
<li>участвовать в беседах <strong>тет-а-тет</strong>
<li>заполнить личный профайл с <strong>анкетными данными</strong>
</ul>
</p>
<p>
Также обратите внимание на <strong>гей-доску для знакомств</strong>.
 Без регистрации и совершенно бесплатно в ней можно разместить свое объявление</p>
<p>Приятного общения! ${!buser?' &nbsp;<button class="regabutton"><a class="rega" href="/signup">Зарегистрироваться</a></button>':''}</p>
<hr>
<h2>Новые профили</h2>
${n.new_users?get_new_users_list(n.new_users):'Пока нет никого.'}
<hr>
<section id="onlineVideo">
<header id="onlineVideoHeader">Живое видео</header>
<section id="videoContainer">
${n.videoUsers && n.videoUsers.length >0 ? vroomers_list(n.videoUsers) : 
`<span id="zagln2">Пока нет никого. <a class="ahero" href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
</section>
</section>
<hr>
<section id="onlineSection">
<header id="onlineHeader">Чат-комнаты.</header>
<section id="onlineContainer">
${lusers && lusers.length >0 ? roomers_list(lusers) : 
`<span id="zagln">Пока нет никого. <a class="ahero" href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
</section>
</section>
<hr>
<h3>Свежие видео</h3>
${n.videos?get_videos(n.videos):'Пока нет видео.'}
<hr>
${doska.doska({})}
<hr>
${people({})}
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
s+=`<div data-roombid="${el.us_id}" сlass="img-online-container">
<img class="img-online" src="${el.ava?(el.isava==2?el.ava:'/images/default.jpg'):'/images/default.jpg'}">
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
s+=`<div class="vroomers" data-roomidi="${el.us_id}" class="imgContself"><h5><a href="/webrtc/${el.us_id}"><span>${el.nick}</span></a></h5>
<video class="videovroomers" src="${el.vsrc}" data-vidi="${el.us_id}"></video></div>`;	
})	
return s;
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
	s+=`<div data-vvid="${el.id}"><video src="/vid/${el.src}" controls></video></div>`;	
	})
	return s;
}
function get_meta(){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="Мультичат для ЛГБТ сообщества России" />
<meta property="og:url" content="httpы://gayroom.ru" />
<meta property="og:image" content="https://gayroom.ru/images/home.jpg" />
<meta property="og:description" content="Анонимный секс-чат по вебкамере для общения и знакомств среди геев и лесбиянок в России. 
Получение донатов в биткоинахю" />

<meta property="og:site_name" content="gayroom" />
<meta itemprop="name" content="Мультичат для ЛГБТ сообщества России" />
<meta itemprop="description" content="Анонимный секс чат по вебкамере для общения и знакомств среди геев и лесбиянок в России. 
Получение донатов в биткоинах." />`
return s;
}
