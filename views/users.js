const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
const {js_help}=require('../libs/helper.js'); 
let users=n=>{
const buser=n.user;
return `<!DOCTYPE html><!-- users.js --><html lang="en"><head>${html_head.html_head({title:"Пользователи", meta:get_meta(n.meta),csslink:"/css/main2.css",
cssl:["/css/users.css"]})}

</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Пользователи</h3>
<hr>
<form name="Z" method="POST" action="/api/get_suchen">
<div class="halter"><label>
<strong class="strong">Возраст:</strong>
<input type="number" name="ab" min="18" max="99" value="18"> - <input type="number" name="bis" min="19" max="100" value="60">
</label></div>&nbsp;&nbsp;&nbsp;
<div class="halter"><label><strong class="strong">Город:</strong>&nbsp;<input name="city" type="text" placeholder="Москва"></label></div>&nbsp;&nbsp;&nbsp;
<div class="halter"><label><strong class="strong">Ориентация:</strong>
<select name="bi" id="zType" required>
	<option value="gay">гей</option>
	<option value="bi">би</option>
	<option value="lesbi">лесби</option>
	<option value="trans">транс</option>
	</select></label></div>&nbsp;&nbsp;&nbsp;
	<div class="halter"><label><strong class="strong">Ключевое слово:</strong>&nbsp;<input name="keywort" type="text"></label></div>
	<div class="halter">&nbsp;<input type="submit" value="Поиск"></div>
	</form><br>
<button onclick="fetch_all_suchen(this);">Показать всех</button>	
<hr>
${n.result?get_users(n.result):'Нет никого.'}
</main>
${js_help(["/js/users.js"])}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={users};
function get_users(n){
let s='<section id="usersection">';
n.forEach(function(el, i){
s+=`<hr>${i+1}) <div class="newuserdiv" data-id="${el.id}" data-at="${el.crat}"><div>created: ${el.crat}</div>
<div class="newuserleft"><img class="newuserfoto" src="${el.ava?el.ava:'/images/default.jpg'}"/></div>
<div class="newuserrite">
<div><a href="/webrtc/${el.id}">${el.bname}</a>
<div>${el.email}</div>
<div>last login: ${el.ll}</div>
<div>items: ${el.items}</div>
<div><button data-id="${el.id}" data-nick="${el.bname}" data-email="${el.email}"
 onclick="send_welcome_mail(this);">welcome on board</button></div>
</div></div><hr>`;
	})
	s+='</section><br><br><button onclick="get_more_users(this);">Показать еще</button>';
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

<meta property="og:site_name" content="gayroom" />
<meta itemprop="name" content="${n.main_page.title}" />
<meta itemprop="description" content="${n.main_page.description}" />`
return s;
}

