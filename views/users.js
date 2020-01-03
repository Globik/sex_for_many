const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  

let users=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Пользователи", csslink:"/css/main2.css",
cssl:[]})}

</head><body><!-- profile -->
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Пользователи</h3>
${n.result?get_users(n.result):'Нет никого.'}
</main>
<!-- {js_help(["/js/user_profile.js"])} -->
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={users};
function get_users(n){
	let s="<ul>"
n.forEach(function(el, i){
	s+=`<li>${el.bname}`;
	})
	s+="</ul>";
	return s;
	}
