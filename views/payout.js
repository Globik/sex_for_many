const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
  // const moment=require('moment');
  const {one_token_btc} = require('../config/app.json');
   const vert_menu = require('./vert_menu.js');
const {js_help} = require('../libs/helper.js');
const payout = n=>{
const buser=n.user;
let {model}=n;
return `<!DOCTYPE html><html lang="en"><!-- payout.js -->
<head>${html_head.html_head({title:"Выплаты",
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/payout.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<h3>Выплаты</h3>
${n.payout?get_payout(n.payout, one_token_btc):'Нет выплат'}
</div></main>
<script src="/js/payout.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
</body></html>`;
}
module.exports={payout}
function get_payout(n, one_token_btc){
let s='';
n.forEach(function(el,i){
s+=`<form method="post" action="/api/payout_money" name="suka">
<div class="pdiv"><label>id: </label><br><input type="number" disabled name="id" value="${el.id}"></div>
<div class="pdiv"><label>email: </label><br><input type="email" disabled name="email" value="${el.email}"></div>
<div class="pdiv"><label for="rublinput${i}">[${el.items} / ${(el.items*el.proz)/100}] => Отстегнуть биткоинов: </label><br>
<input id="rublinput${i}" name="amount" type="number" value="${((el.items*el.proz)/100)*one_token_btc}" required></div>
<div class="pdiv"><label>Биткоин адрес: <a href="bitcoin:${el.cadr}?amount=${((el.items*el.proz)/100)*one_token_btc}?label=${(el.items*el.proz)/100}20%${el.bname}">${el.cadr}?amount=${((el.items*el.proz)/100)*one_token_btc}?label=${(el.items*el.proz)/100} ${el.bname}</a>
</label><br><input type="text" name="bcard" value="${el.cadr}" disabled></div>
<div class="pdiv"><label>Ник: </label><br><input type="text" name="bname" value="${el.bname}" disabled></div>
<div class="pdiv"><input type="submit" value="Отстегнул" name="psubmit"></div></form>`;	
})
return s;
	}
