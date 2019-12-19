const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;

let newmsg=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Проверить объявления", csslink:"/css/main2.css",
cssl:["/css/newmsg.css"]})}
</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Проверить объявления</h3>
${n.result&&n.result.length>0?get_msg(n.result):'Нет новых объявлений'}
</main>
${js_help(["/js/newmsg.js"])}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={newmsg};
function get_msg(n){
let s='';
n.forEach(function(el,i){
s+=`<div data-id="${el.id}" class="chelobi"><header><b>${el.bnick}</b></header><p class="chelp">${el.msg}</p>
<div><button data-mid="${el.id}" onclick="check_msg(this);">добро</button>
<button data-did="${el.id}" onclick="del_msg(this);">удалить</button></div>
</div>`;
});
return s;	
}
