const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
var warnig=false,haupt_ban=false;

const main_page=function(n){
const {lusers,showmodule:{mainmenu,profiler}}=n;
const buser=n.user,roomers=n.roomers;

return `<!DOCTYPE html><html lang="en">
<head>${html_head.html_head({title:"home", meta:get_meta(),csslink:"/css/main2.css",luser:buser})}
<style>
table{background:yellow;width:100%;}
figure{backgrund:red;margin:0;padding:0;width:20%;}
.duka{bckground:pink;width:90px;}
.views{width:90px;}
th,td{border:1px solid green;text-align:center;}
img{overflow:hidden;}
figcaption{ackground:brown;width:90px;}
</style>
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser,mainmenu:mainmenu,profiler:profiler})}</nav>
${haupt_ban ?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
${endf}
<main id="pagewrap"> 
${n.m?n.m.msg:''}<br><br>
<h4>Users: </h4>
{users_list(lusers)}
<br><a href="/webrtc/${buser?buser.id:'no_name'}">${buser?buser.id:'no name'}</a>
<hr>
<h4>Roomers:</h4>
<div id="imgContainer">
${lusers && lusers.length >0 ? roomers_list(lusers) : ''}
</div>
</main>
<script src="/js/gesamt.js"></script>

${endf}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports={main_page};

function showModule(n){var s1='';
if(n.showmodule.showmodule){s1=`<div style="background:lightgreen">Advertizing Block. Activity: ${n.showmodule.showmodule}...</div>`;}
return s1;
}
function douser(buser){
var s2='';
if(buser){
s2=`<ul><li><b>name: </b>${buser.name}</li>
${(buser.email ? `<li><b>email: </b>${buser.email}</li>` : `<li>No Mail</li>`)}
<li><b>items: </b>${buser.items}</li>
<li><b>w_items: </b>${buser.w_items}</li></ul>`;}
return s2;}

function users_list(n){
let s='';
if(Array.isArray(n)){
 s+='<ul>';
 n.forEach((el,i)=>{
s+=`<li><a href="/webrtc/${el.name}">${el.name}</a>`;
});
s+='</ul>';
   }
return s;
}

function roomers_list(n){
let s='';
if(Array.isArray(n)){
 n.forEach(function(el,i){
s+=`<table data-roomid="${el.room_id}" title="${el.descr}">
<tr><th>name</th><th>status</th><th>viewers</th></tr>
<tr><td class="duka">
<figure>${el.src ? `<img src="${el.src}" width="80px" height="60px"/>`:''}
<figcaption><a href="/webrtc/${el.room_id}">${el.nick}</a></figcaption>
</figure></td><td>${el.descr}</td><td class="views">${el.v}</td></table>
`;
});
 }
return s;
//<table> 
//<tr><th class="suka">name</th><th>status</th><th>viewers</th></tr>
//<tr><td class="duka"><figure><img width="80px" height="60px" src="donatebutton.jpg"><figcaption>globi</figcaption></figure></td>
//<td>earn some money</td><td class="views">10</td></tr>
//</table>
}


	function clearCache(){
		let s=``;
	s+=``;
return s;}
function get_meta(){
let s='';
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
	return s;
}
