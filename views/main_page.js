const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const vert_menu=require('./vert_menu.js');
const doska=require('./doska');
const {people} = require('./people');
const {get_banner, get_banner_podval}=require('./reklama_s');
const {check_age}=require('../config/app.json');

const main_page=function(n){
const {lusers}=n;
const buser=n.user,roomers=n.roomers;

return `<!DOCTYPE html><html lang="en"><!-- main_page.js -->
<head>${html_head.html_head({title:"Globikon - вебкам сайт, стримы для всех", meta:get_meta(n.meta),
csslink:"/css/main2.css",cssl:["/css/main_page.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
${check_age?`
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
`:''}
${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<canvas id="canvasi" width="600" height="200" style="margin:0 auto;"ontouchmove="grob(event)" onmousemove="dropBomb(event)"></canvas>
${n.m?n.m.msg:''}
<div id="privet">${buser?`Привет <a href="/webrtc/${buser.id}">${buser.bname}</a>!`:'Привет, гость!'}</div>
<article id="mainArticle"><h1>Добро пожаловать на сайт видеотрансляций!</h1>
<p>После простой регистрации вы сможете:
<ul id="ulKomnata">
<li><strong>стримить видео</strong>
<li>получать от юзеров <strong>чаевые в биткоинах</strong> и <strong>токенaх</strong>.
</ul>
</p>
<p>
Также обратите внимание на <strong>доску объявлений для знакомств</strong>.
 Без регистрации и совершенно бесплатно в ней можно разместить свое объявление</p>
<p> ${!buser?' &nbsp;<button class="regabutton"><a class="rega" href="/signup">Хочу стать стримером!</a></button>':` &nbsp;<button class="regabutton"><a class="rega" href="/webrtc/${buser.id}">Хочу стримить!</a></button>`}</p></article>
<hr>
<section id="onlineVideo">
<header id="onlineVideoHeader">Чат-комнаты</header>
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
<script>

var cnv = document.getElementById('canvasi');
if(cnv){
var c = cnv.getContext('2d');
//c.fillStyle='rgb(200,0,0)';
//c.fillRect(0,0,440,200);
var ww=cnv.width;
var hh=cnv.height;
//var show=document.getElementById('show');
//show.checked=true;

var go;

var b=0;

var text="globikon";
var cnv2=document.createElement('canvas');
var c2=cnv2.getContext('2d');
    cnv2.width=190;
    cnv2.height=30;

var h1=cnv2.height;
var w =cnv2.width;

c2.font="bold 260% Arial";
c2.fillText(text,0,20);

var imd=c2.getImageData(0,0,w,h1);

var ab=new Uint8Array(imd.data);

var tiles=[];
for(var y1=0;y1<h1;y1+=1){
for(var x1=0;x1<w;x1+=1){
ix=((y1*w+x1)*4)-1;

var pixel=ab[ix];
if(pixel & 255){
tiles.push({
 orx: (5*x1)-7,  ory:5*y1+hh*.25,
 curx:(5*x1)-7, cury:5*y1+hh*.25,
 vx:0,vy:0,f:0});}
}}

requestAnimationFrame(render);
b=1;

var then=new Date()*0.001;
var tx=50;
var ty=75;

var velX=160;
var velY=160;

function render(){
if(b !=0){ requestAnimationFrame(render);}

c.fillStyle='rgba(0,0,0,0.2)';
c.fillRect(0,0,ww,hh);
var now=new Date()*0.001;
var delta=(now-then);
then=now;

tiles.forEach(function(it,i){
var tile = tiles[i];

if(tile.f> 2.0){ 
tile.vx *= tile.f;
tile.vy *= tile.f;

tile.curx += tile.vx;
tile.cury += tile.vy;

 tile.f *= 0.2;
 if(tile.curx <= 0 || tile.curx >= 436) { tile.vx *= -1;}
 if(tile.cury <= 0 || tile.cury >= 200){tile.vy *= -1;}

}

 else if(tile.curx !=tile.orx || tile.cury !=tile.ory){
 var difx= (tile.orx-tile.curx)*0.06;
 var dify= (tile.ory-tile.cury)*0.06;
 if(Math.abs(difx) < 0.5){tile.curx = tile.orx;}
 else{tile.curx += difx;}
 if(Math.abs(dify) < 0.5){tile.cury = tile.ory;}
 else{tile.cury += dify;}
} 
 else {tile.f=0;}


c.save();
c.fillStyle='rgb(0,0,200)';
c.fillRect(25+tile.curx,-1+tile.cury,4,4);
c.restore();
});

//bomb(tx,ty);
frei(tx,ty);
 if(tx <= 0) {tx=0;velX = - velX;}
 if(tx >= ww-10) { tx = ww-10; velX = - velX;}
 if(ty <=0) {ty=0;velY = - velY;}
 if(ty >= hh-10){ty=hh-10; velY = - velY;}
 tx+= delta * velX;
 ty+= delta * velY;
}

function bomb(x2,y2){
//if(document.getElementById('show').checked){
frei(x2,y2);
//}
explode(x2,y2);
}

function grob(event){
var touchobj=event.changedTouches[0];
posx=parseInt(touchobj.clientX)-cnv.getBoundingClientRect().left;
posy=parseInt(touchobj.clientY)-cnv.getBoundingClientRect().top;
explode(posx,posy);
event.preventDefault();
}



function dropBomb(event){
posx= event.clientX-cnv.getBoundingClientRect().left;
posy = event.clientY-cnv.getBoundingClientRect().top;
explode(posx,posy);
}

function explode(x, y){
tiles.forEach(function(it,i){
var tile = tiles[i];
var xdiff =tile.curx-x;
var ydiff = tile.cury-y;
var dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
var randRange = 220+(Math.random()*30);
var range = randRange-dist;
var force = 3*(range/randRange);
if(force > tile.f){
tile.f = force;
var radians = Math.atan2(ydiff, xdiff);
tile.vx = Math.cos(radians);
tile.vy = Math.sin(radians);
}
});
}





function frei(x2,y2){
var pass= pass|| 8;
c.save();
c.globalAlpha=0.025;
c.globalCompositeOperation='lighter';
c.fillStyle='rgba(255,255,0,1)';
for(var k=1;k <= pass;k++)
for(var m=-1.5;m<3;m++){
for(var n=-1.5;n<3;n++){
c.fillRect(x2+n * k-3, y2+m * k-3, 6, 6);
}}

c.restore();
c.save();
c.fillStyle='white';
c.fillRect(x2-1.5,y2-1.5,3,3);
c.restore();
}

}
</script>

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
${el.typ=='activ'?'':`<div data-indicator="${el.us_id}" class="indicator${el.typ=='all'|| el.typ=='fake'?' red':' green'}"></div>`}
<a href="/webrtc/${el.us_id}" itemprop="url">
<header itemprop="name">${el.nick}</header></a>
<p itemprop="description">${el.stat?(el.stat).substring(0,52):"I'm online :)"}</p>
<meta itemprop="duration" content="PT6M58S">
<meta itemprop="isFamilyFriendly" content="false">
<span itemprop="uploadDate">2020-06-05T00:00:00</span><br>
<span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject">
<img itemprop="contentUrl" class="videovroomers" data-avid="${el.us_id}" onerror="foto_error(this);" src="${el.typ=='fake'?'/vid/'+el.p:(el.p?el.p:(el.ava?el.ava:'/images/unnamed.jpg'))}" data-vidi="${el.us_id}">
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
