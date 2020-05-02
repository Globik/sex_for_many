const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  

let users=n=>{
const buser=n.user;
return `<!DOCTYPE html><!-- users.js --><html lang="en"><head>${html_head.html_head({title:"Пользователи", csslink:"/css/main2.css",
cssl:["/css/users.css"]})}

</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Пользователи</h3>
<hr>
<form name="Z" method="POST" action="/api/get_suchen">
<label>
<strong class="strong">Возраст:</strong>
<input type="number" name="ab" min="18" max="99" value="18"> - <input type="number" name="bis" min="19" max="100" value="60">
</label>&nbsp;&nbsp;&nbsp;
<label><strong class="strong">Город:</strong>&nbsp;<input name="city" type="text" placeholder="Москва"></label>
<br><br><label><strong class="strong">Ориентация:</strong>
<select name="bi" id="zType" required>
	<option value="gay">гей</option>
	<option value="bi">би</option>
	<option value="lesbi">лесби</option>
	<option value="trans">транс</option>
	</select></label>&nbsp;&nbsp;&nbsp;
	<label><strong class="strong">Ключевое слово:</strong>&nbsp;<input name="keywort" type="text"></label>
	<input type="submit" value="Искать">
	</form><br>
<button onclick="fetch_all_suchen(this);">Показать всех</button>	
<hr>
${n.result?get_users(n.result):'Нет никого.'}
</main>
${js_help(["/js/users.js"])}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={users};
function get_users(n){
let s='<section id="usersection">';
n.forEach(function(el, i){
s+=`<div class="newuserdiv" data-id="${el.id}" data-at="${el.crat}">
<div class="newuserleft"><img class="newuserfoto" src="${el.ava?el.ava:'/images/default.jpg'}"/></div>
<div class="newuserrite">
<div><a href="/webrtc/${el.id}">${el.bname}, ${el.age?el.age:18}</a></div>
${el.bi?`<div>${el.bi}</div>`:''}
${el.city?`<div>${el.city}</div>`:''}
${el.msg?`<div>${el.msg}</div>`:''}
</div></div>`;
	})
	s+='</section><br><br><button onclick="get_more_users(this);">Показать еще</button>';
	return s;
	}
