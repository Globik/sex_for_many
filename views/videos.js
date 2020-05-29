const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const moment=require('moment');
const doska=require('./doska');
const {get_banner, get_banner_podval}=require('./reklama_s');
const videos=function(n){
const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- videos.js -->
<head>${html_head.html_head({title:"Видео", meta:get_meta(n.meta),csslink:"/css/main2.css",cssl:["/css/videos.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}
<main id="pagewrap">
<h1>Видео</h1>
${n.videos?get_videos(n.videos,n):'Нет видео.'}
<hr>
${doska.doska({})}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
<input id="superuser" type="hidden" value="${buser && buser.brole=='superadmin'?true:false}">
</main>
<script src="/js/videos.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}
module.exports={videos};

function get_videos(n,l){
let s='<section id="uservideo">';
n.forEach(function(el, i){
s+=`<div class="videodiv" data-id="${el.id}" data-at="${el.cr_at}">
<div><span><a href="/webrtc/${el.usid}">${el.nick}</a></span>&nbsp;<span>${moment(el.cr_at).format('DD-MM-YYYY')}</span>&nbsp;
<span>Просмотров: </span><span>${el.v}</span></div>
<video data-vid="${el.id}" src="/vid/${el.src}" controls onplay="vplay(this);"></video>
<div>${l.user&&l.user.brole=='superadmin'?`<button data-bid="${el.id}" data-src="${el.src}" onclick="del_video(this);">Удалить</button>`:''}
</div></div>`;
	})
	s+='</section><br><br><button onclick="get_more_videos(this);">Показать еще</button>';
	return s;	
}
function get_meta(n){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="${n.video.title}" />
<meta property="og:url" content="${n.url}" />
<meta property="og:image" content="${n.image}" />
<meta property="og:description" content="${n.video.description}" />

<meta property="og:site_name" content="gayroom" />
<meta itemprop="name" content="${n.video.title}" />
<meta itemprop="description" content="${n.video.description}" />`
return s;
}
