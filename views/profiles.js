const html_head=require('./html_head.js');  
const html_nav_menu=require('./html_nav_menu.js');
const html_admin_nav_menu=require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
let profiles = n=>{
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- profiles.js --><head>${html_head.html_head({title:"Профили", csslink:"/css/main2.css",
cssl:["/css/profiles.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right">
<h3>Sessions</h3>
<button onclick="get_session();">get_session</button><br>
<output id="outsession"></output>
<h3>Профили</h3>
${n.err?`<hr>${n.err}<hr>`:''}
<hr>
<header>Удалить пользователей, которые за последние три месяца не логинились.</header>
<button onclick="del_users(this);">Удалить</button><hr>
<!--<ul>

{n.result?get_profiles(n):'Нет еще ни одного профиля.'}
</ul> -->
<hr><h5>Размер базы данных</h5>
<button onclick="db_total_size(this);">total</button>&nbsp;<span id="totaldbspan">0</span><hr>
<h5>Размер таблиц</h5>
<button data-table="buser" onclick="get_table(this);">buser</button>&nbsp;<span id="buser">0</span><br>
<button data-table="blog" onclick="get_table(this);">blog</button>&nbsp;<span id="blog">0</span><br>
<button data-table="chat" onclick="get_table(this);">chat</button>&nbsp;<span id="chat">0</span><br>
<button data-table="cladr" onclick="get_table(this);">cladr</button>&nbsp;<span id="cladr">0</span><br>
<button data-table="profile" onclick="get_table(this);">profile</button>&nbsp;<span id="profile">0</span><br>
<button data-table="video" onclick="get_table(this);">video</button>&nbsp;<span id="video">0</span><br>
<hr>
<form method="POST" action="/api/cb/yam">
<input type="text" name="name" placeholder="name"><input type="text" name="family" placeholder="fammily"><input type="submit" value="send">
</form>
<hr>
<h1>Mail test</h1>
<h4>gru5@yandex.ru</h4>
<button onclick="send_mail(this);">send mail</button>
<hr>
</div></main>
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
