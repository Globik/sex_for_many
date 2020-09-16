const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
let privacy=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"privacy", meta:get_meta(n.meta), csslink:"/css/main2.css",
cssl:["/css/advertise.css"]})}

</head><body><!-- privacy.js -->
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right">
<h1>privacy</h1>
<article id="privacyArticle">${n.result?n.result.art : 'Пусто.'}</article>
${buser&&buser.brole=='superadmin'?get_redact():''}
</div></main>
${buser&&buser.brole=="superadmin"?js_help(["/js/privacy.js"]):''}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={privacy}
function get_redact(){
let s=`<br><hr><button onclick="redaktiert(this);">редактировать</button><hr>
<form id="rForm" name="rform" method="post" action="/api/save_post_privacy">
<textarea id="rText" name="rtext"></textarea><br>
<input type="submit" value="Сохранить">&nbsp;&nbsp;<input type="reset" value="Отменить">
</form>`;
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

