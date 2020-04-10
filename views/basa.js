const html_head = require('./html_head');
const html_nav_menu = require('./html_nav_menu');
const html_admin_nav_menu = require('./html_admin_nav_menu');
const html_footer = require('./html_footer');
const { js_help } = require('../libs/helper.js');
var warnig = false;

const basa = function(n){
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- basa.js -->
<head>${html_head.html_head({title:"База знаний", meta:get_meta(),csslink:"/css/main2.css",cssl:["/css/advertise.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">
<h1>База знаний</h1>
<article id="rArticle">
${n.art?n.art.art:'Пусто.'}
</article>
${buser&&buser.brole=='superadmin'?get_redact():''}
</main>
${buser&&buser.brole=="superadmin"?js_help(["/js/basa.js"]):''}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports = {basa};
function get_redact(){
let s=`<br><hr><button onclick="redaktiert(this);">редактировать</button><hr>
<form id="rForm" name="rform" method="post" action="/api/save_post_basa">
<textarea id="rText" name="rtext"></textarea><br>
<input type="submit" value="Сохранить">&nbsp;&nbsp;<input type="reset" value="Oтменить">
</form>`;
return s;
	}
	
	function get_meta(){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="База знаний"/>
<meta property="og:description" content="База знаний gayroom"/>

<meta property="og:site_name" content="gayroom"/>
<meta itemprop="name" content="База знаний"/>
<meta itemprop="description" content="База знаний gayroom"/>`
return s;
//<meta property="og:image" content="http://alikon.herokuapp.com/images/bona.png"/>
//<meta property="og:url" content="http://alikon.herokuapp.com"/>
}
