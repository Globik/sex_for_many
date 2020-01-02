const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false;

const advertise = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:'Реклама на сайте',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/advertise.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>

${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}


<main id="pagewrap"><h2>Реклама на сайте.</h2>
<article id="rArticle">
${n.art?n.art.art:'Пусто.'}
</article>
${buser&&buser.brole=='superadmin'?get_redact():''}
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
</body>
${buser&&buser.brole=="superadmin"?js_help(["/js/advertise.js"]):''}
</html>`;
}
module.exports={advertise}

function get_redact(){
let s=`<br><hr><button onclick="redaktiert(this);">edit</button><hr>
<form id="rForm" name="rform" method="post" action="/api/save_post_advertise">
<textarea id="rText" name="rtext"></textarea><br>
<input type="submit" value="Сохранить">
</form>`;
return s;
	}
