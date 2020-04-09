const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false;

const advertise = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:'Реклама на сайте', meta:get_meta(),
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/advertise.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>

${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<div id="haupt-banner"><b>Главный баннер.</b>
<a href="#"><img src="/reklama/a4.jpg"/></a>
</div>
<main id="pagewrap"><h1>Заказать рекламу.</h1>
<article id="rArticle">
${n.art?n.art.art:'Пусто.'}
</article>
${buser&&buser.brole=='superadmin'?get_redact():''}
<section id="reklamaPodval"><div><b>Второстепенный баннер.</b></div>
<div class="f"><a class="a" href="#"><img class="img" src="/reklama/b3.jpg"/></a></div></section>
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
</body>
${buser&&buser.brole=="superadmin"?js_help(["/js/advertise.js"]):''}
</html>`;
}
module.exports={advertise}

function get_redact(){
let s=`<br><hr><button onclick="redaktiert(this);">редактировать</button><hr>
<form id="rForm" name="rform" method="post" action="/api/save_post_advertise">
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
<meta property="og:title" content="Заказать рекламу"/>
<meta property="og:description" content="Заказать рекламу на гей сайте. Недорого."/>

<meta property="og:site_name" content="gayroom"/>
<meta itemprop="name" content="Заказать рекламу"/>
<meta itemprop="description" content="Реклама на гей сайте знакомств. Заказать рекламу недорого."/>`
return s;
//<meta property="og:image" content="http://alikon.herokuapp.com/images/bona.png"/>
//<meta property="og:url" content="http://alikon.herokuapp.com"/>
	
	
}

