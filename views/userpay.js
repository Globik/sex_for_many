const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
  const moment=require('moment');
   const vert_menu=require('./vert_menu.js');
   const {one_token_btc} = require('../config/app.json');

const userpay = n=>{
const buser = n.user;
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
${n.owner ? `<div id="btcCount">
<p><strong>You have now <span id="btcCountTokens">${buser.items}</span> tokens = <span id="btcCountBTC">${((buser.items * buser.proz)/100) * one_token_btc}</span> BTC</strong></p>
</div>`:''}
<h3>${buser && buser.lng == 'ru' ? 'Выплаты' : 'Payouts'} ${n.payout && n.payout.length > 0 ? n.payout[0].tom : ''}</h3>
${n.payout && n.payout.length > 0 ? get_payout(n.payout) : 'Нет выплат'}
</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
</body></html>`;
}
module.exports={userpay}
function get_payout(n){
let s='<table><tr><th>BTC</th><th>Date</th></tr>';
n.forEach(function(el,i){
s+=`<tr><td>${el.suma}</td><td>${moment(el.cr_at).format('DD-MM-YYYY, h:mm:ss a')}</td></tr>`;	
})	
s+='</table>';
return s;
}
