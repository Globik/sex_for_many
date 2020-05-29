const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
const {js_help}=require('../libs/helper.js');
let profiles = n=>{
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- profiles.js --><head>${html_head.html_head({title:"Профили", csslink:"/css/main2.css",
cssl:["/css/profiles.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Sessions</h3>
<button onclick="get_session();">get_session</button><br>
<output id="outsession"></output>
<h3>Профили</h3>
${n.err?`<hr>${n.err}<hr>`:''}
<hr>
<header>Удалить пользователей, которые за последние три месяца не логинились.</header>
<button onclick="del_users(this);">Удалить</button><hr>
<ul>
${n.result?get_profiles(n):'Нет еще ни одного профиля.'}
</ul>
</main>
${js_help(['/js/profiles.js'])}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={profiles};
function get_profiles(n){
let s='';
n.result.forEach(function(el,i){
s+=`<li><a href="/home/profile/${el.bname}">${el.bname}</a>&nbsp;${el.age}&nbsp;${el.isava==1?"Авка не проверена!":""}
<li>Просмотрено: ${el.vs}`;	
});
return s;	
}
