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
<head>${html_head.html_head({title:"home", meta:get_meta(),csslink:"/css/main2.css",cssl:["/css/main_page.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap"> 
${n.m?n.m.msg:''}<br>
<br>${buser?`Привет <a href="/webrtc/${buser.id}">${buser.bname}</a>!`:'Привет, гость!'}

<hr>
<section id="onlineSection">
<header id="onlineHeader">Чат-комнаты.</header>
<section id="onlineContainer">
${lusers && lusers.length >0 ? roomers_list(lusers) : 
`<span id="zagln">Пока нет никого. <a href="${buser?`/webrtc/${buser.id}`:'/login'}">Будь первым!</a></span>`}
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
/*
	s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="Sex Videochat Alikon - тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta property="og:description" content="Эротический видеочат для взрослых. Тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta property="og:image" content="http://alikon.herokuapp.com/images/bona.png"/>
<meta property="og:url" content="http://alikon.herokuapp.com"/>
<meta property="og:site_name" content="Alikon"/>
<meta itemprop="name" content="Sex Videochat Alikon"/>
<meta itemprop="description" content="Эротический видеочат для взрослых - тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta itemprop="image" content="http://alikon.herokuapp.com/images/bona.png"/>
`;
*/
	return s;
}

