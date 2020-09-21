const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
  const moment=require('moment');
   const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
const userpay = n=>{
const buser=n.user;
let {model}=n;
return `<!DOCTYPE html><html lang="en"><!-- userpay.js -->
<head>${html_head.html_head({title:"Выплаты",
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/userpay.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<h3>Выплаты ${buser.bname}</h3>
<h6>Cовет: заглядывайте в спам в своем почтовом ящике</h6>
${n.payout?get_payout(n.payout):'Нет выплат'}
</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
</body></html>`;
}
module.exports={userpay}
function get_payout(n){
let s='<table><tr><th>Сумма</th><th>Дата</th></tr>';
n.forEach(function(el,i){
s+=`<tr><td>${el.suma}</td><td>${moment(el.cr_at).format('DD-MM-YYYY,h:mm:ss a')}</td></tr>`;	
})	
s+='</table>';
return s;
}
