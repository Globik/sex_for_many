const moment=require('moment')
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const vert_menu=require('./vert_menu.js');
const doska=require('./doska');
const {get_banner, get_banner_podval}=require('./reklama_s');
const article_v=function(n){

const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- article_v.js -->
<head>${html_head.html_head({title:(n.result ? n.result.title:'article'), meta:get_meta(n.result), 
csslink:"/css/main2.css",cssl:["/css/article_v.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap"> 
${vert_menu.vert_menu({})}
<div id="right">
<div id="inlineFoto"></div>
<article>${n.result?get_post(n.result):''}</article>
${buser && buser.brole=="superadmin"?`<button onclick='edit_article(this)'>Редактировать</button>
<form name='formw' method='post' action='/api/save_foto_blog'><input name='filew' type='file'>
<input type='submit' value='Загрузить картинку'></form>`:""}<br>
<div id="txtContainer"><textarea id="rText"></textarea>
<textarea id="rMeta">${n.result && n.result.descr?n.result.descr:''}</textarea>
<br><button onclick="save_das(this);">Сохранить</button>

</div>
<hr>
${doska.doska({})}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</div></main>
${buser && buser.brole=="superadmin"?'<script src="/js/article_v.js"></script>':''}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}

module.exports={article_v};
function get_post(n){
	let s='';
	
		s+=`<h1 id="articleHeader" data-id="${n.id}" contenteditable="false">${n.title}</h1><span class="d-author">${n.auth}</span>, 
		<span class="d-date">${moment(n.cr_at).format('YYYY-DD-MM')}</span><div id="articleView">${n.body}</div>`

		return s;
	}
function get_meta(n){
let s='';
s+=`${n.descr?`<meta name="description" content="${n.descr}">`:''}
<meta property="og:title" content="${n.title}">
${n.descr?`<meta property="og:description" content="${n.descr}">`:''}
<meta itemprop="name" content="${n.title}">`;
return s;	
}
