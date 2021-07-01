const html_head=require('./html_head.js');  
const html_nav_menu=require('./html_nav_menu.js');
const html_admin_nav_menu=require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
let seans = n=>{
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- seans.js --><head>${html_head.html_head({title:"Стримы", csslink:"/css/main2.css",
/* cssl:["/css/profiles.css"]*/})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right">
<h3>Seans</h3>

${n.result ? get_seans(n) : 'Нет еще ни одного сеанса.'}

</div></main>
<!-- {js_help(['/js/profiles.js'])} -->
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports = {seans};
function get_seans(n){
let s='';
n.result.forEach(function(el,i){
s+=`<div class="seans"><div>${el.sname},&nbsp;${el.typ}</div><div>Старт: ${el.crat}</div><div>Финиш: ${el.endat}</div></div>`
});
return s;	
}
