const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;

let newavas=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Проверить аватарки", csslink:"/css/main2.css",
cssl:["/css/newavas.css"]})}
</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Проверить аватарки</h3>
${n.err?`<hr>${n.err}<hr>`:''}
<ul>
${n.result?get_avas(n.result):'Нет новых аватарок.'}
</ul>
</main>
${js_help(["/js/user_avas.js"])}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={newavas};
function get_avas(n){
let s='';
if(Array.isArray(n)){
n.forEach(function(el,i){
s+=`<li data-pname="${el.bname}"><a href="/home/profile/${el.bname}">${el.bname}</a>&nbsp;<img src="${el.ava}">&nbsp;
<label class="cntlb2"><span>Одобрить</span><input type="checkbox" data-fname="${el.bname}" onchange="check_ava(this);">
<span class="mark2"></span></label><button data-dname="${el.bname}" onclick="delete_ava(this);">удалить</button>`;	
});
}
return s;	
}
