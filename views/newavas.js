const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
const {js_help}=require('../libs/helper.js');
let newavas=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- newavas.js --><head>${html_head.html_head({title:"Проверить аватарки", csslink:"/css/main2.css",
cssl:["/css/newavas.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Проверить аватарки</h3>
${n.err?`<hr>${n.err}<hr>`:''}
<ul>
${n.result?get_avas(n.result):'Нет новых аватарок.'}
</ul>
<div><button onclick="begin_was();">begin_was</button></div>
<h5>Local video:</h5>
<div><video id="localVideo"></video></div>
<h5>Remote video:</h5>
<div><video id="remoteVideo"></video></div>
<output id="out"></output>
</main>
${js_help(["/js/jssip.min.js","/js/user_avas.js"])}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
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
