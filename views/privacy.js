const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  

let privacy=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"privacy", csslink:"/css/main2.css",
cssl:["/css/privacy.css"]})}

</head><body><!-- privacy -->
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>privacy</h3>
<article id="privacyArticle">${n.result?n.result.art : 'Пусто.'}</article>
${buser&&buser.brole=='superadmin'?get_redact():''}
</main>
${buser&&buser.brole=="superadmin"?js_help(["/js/privacy.js"]):''}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={privacy}
function get_redact(){
let s=`<br><hr><button onclick="redaktiert(this);">edit</button><hr>
<form id="rForm" name="rform" method="post" action="/api/save_post_privacy">
<textarea id="rText" name="rtext"></textarea><br>
<input type="submit" value="Сохранить">
</form>`;
return s;
	}
