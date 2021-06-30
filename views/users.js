const html_head = require('./html_head.js'); // head.js 
const html_nav_menu = require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu = require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
const {get_banner, get_banner_podval} = require('./reklama_s');
const vert_menu = require('./vert_menu.js');
const {js_help} = require('../libs/helper.js'); 
let users=n=>{
const buser=n.user;
return `<!DOCTYPE html><!-- users.js --><html lang="en"><head>${html_head.html_head({title:"Пользователи", meta:get_meta(n.meta),csslink:"/css/main2.css",
cssl:["/css/users.css"]})}

</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
${n.banner && n.banner.length ? `<div id="haupt-banner">${get_banner(n.banner)}</div>` : ''}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<h3>${buser && buser.lng == 'ru' ? 'Пользователи' : 'Users'}</h3>
<hr>
<form name="Z" method="POST" action="/api/get_suchen">
<div class="halter"><label>
<strong class="strong">${buser && buser.lng == 'ru' ? 'Возраст' : 'Age'}:</strong>
<input type="number" name="ab" min="10" max="100" value="18"> - <input type="number" name="bis" min="10" max="100" value="60">
</label></div>&nbsp;&nbsp;&nbsp;

<!-- <div class="halter"><label><strong class="strong">Город:</strong>&nbsp;
<input name="city" type="text" placeholder="Москва"></label></div>&nbsp;&nbsp;&nbsp; -->

<div class="halter"><label><strong class="strong">${buser && buser.lng == 'ru' ? 'Ориентация' : 'Orientation'}:</strong>
<select name="bi" id="zType" required>
<option value="hetero">${buser && buser.lng == 'ru' ? 'гетеро' : 'hetero'}</option>
	<option value="gay">${buser && buser.lng == 'ru' ? 'гей' : 'gay'}</option>
	<option value="bi">${buser && buser.lng == 'ru' ? 'би' : 'bi'}</option>
	<option value="lesbi">${buser && buser.lng == 'ru' ? 'лесби' : 'lesbi'}</option>
	<option value="trans">${buser && buser.lng == 'ru' ? 'транс' : 'trans'}</option>
	</select></label></div>&nbsp;&nbsp;&nbsp;
	<div class="halter"><label><strong class="strong">${buser && buser.lng == 'ru' ? 'Ключевое слово' : 'Keyword'}:</strong>&nbsp;<input name="keywort" type="text"></label></div>
	<div class="halter">&nbsp;<input type="submit" value="${buser && buser.lng == 'ru' ? 'Поиск' : 'Search'}"></div>
	</form><br>
<button onclick="fetch_all_suchen(this);">${buser && buser.lng == 'ru' ? 'Показать всех' : 'Show all'}</button>	
<hr>
${n.result ? get_users(n.result, buser) : `${buser && buser.lng == 'ru' ? 'Нет никого' : 'No results'}`}
${n.banner && n.banner.length ? `<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>` : ''}
<input type="hidden" id="Buser" value="${buser && buser.brole == 'superadmin' ? true : false}">
<input type="hidden" id="Lang" value="${buser && buser.lng == 'ru' ? true : false}">
</div>
</main>
${js_help(["/js/users.js"])}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports = {users};
function get_users(n, buser){
let s='<section id="usersection">';
n.forEach(function(el, i){
s+=`<hr><div class="newuserdiv" data-id="${el.id}" data-at="${el.crat}">
<div>${buser && buser.lng == 'ru' ? 'зарегистрирован' : 'created'}: ${el.crat}</div>
<div class="newuserleft"><img class="newuserfoto" src="${el.ava?el.ava:'/images/default.jpg'}"/></div>
<div class="newuserrite">
<div><a href="/webrtc/${el.id}">${el.bname}</a>,&nbsp;${el.bage},&nbsp;${el.sexor}</div>
${buser && buser.brole == 'superadmin' ? `<div>${el.email}</div>` : ''}
${el.stat ? `<div>${el.stat}</div>` : ''}
<div>${buser && buser.lng == 'ru' ? 'последний раз был' : 'last login'}: ${el.ll}</div>
${buser && buser.brole == 'superadmin' ? `<div>items: ${el.items}</div>
<div><button data-id="${el.id}" data-nick="${el.bname}" data-email="${el.email}"
 onclick="send_welcome_mail(this);">welcome on board</button></div>` : ''}
</div></div><hr>`;
	})
	s+=`</section><br><br><button onclick="get_more_users(this);">${buser && buser.lng == 'ru' ? 'Показать еще' : 'Get more'}</button>`;
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

