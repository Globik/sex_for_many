const html_head=require('./html_head.js');
const html_nav_menu=require('./html_nav_menu.js');
const vert_menu=require('./vert_menu.js');
const html_admin_nav_menu=require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
const {js_help}=require('../libs/helper.js');
let token = function(n){
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- token.js --><head>${html_head.html_head({title:"Купить токены", csslink:"/css/main2.css",
cssl:["/css/token.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<h3>Купить токены</h3>
<h4>100 токенов = 100 рублей.</h4>
<!-- https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage -->
<form method="POST" name="yandexform" action="https://money.yandex.ru/quickpay/confirm.xml">
<input type="hidden" name="receiver" value="4100115502427578">
<input type="hidden" name="formcomment" value="Покупка токенов">
<input type="hidden" name="short-dest" value="Покупка токенов">
<input type="hidden" name="label" value="${buser?buser.bname:'anonym'}">
<input type="hidden" name="quickpay-form" value="shop">
<input type="hidden" name="targets" value="Купить 100 токенов">
<input type="hidden" name="sum" value="2" data-type="number">
<input type="hidden" name="successURL" value="https://globikon.space">
<div>
<label><input type="radio" name="paymentType" value="PC">Яндекс.Деньгами</label>
<label><input type="radio" name="paymentType" checked value="AC">Банковской картой</label>
</div><div>
<input type="submit" value="Купить"></div>
</form>
</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={token};
