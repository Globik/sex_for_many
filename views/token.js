const html_head=require('./html_head.js');
const html_nav_menu=require('./html_nav_menu.js');
const html_admin_nav_menu=require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
const {js_help}=require('../libs/helper.js');
let token = function(n){
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- token.js --><head>${html_head.html_head({title:"Профили", csslink:"/css/main2.css",
cssl:["/css/token.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Купить токены</h3>
<!-- https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage -->
<form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
<input type="hidden" name="receiver" value="4100115502427578">
<input type="hidden" name="formcomment" value="Покупка токенов">
<input type="hidden" name="short-dest" value="Покупка токенов">
<input type="hidden" name="label" value="${buser.bname}">
<input type="hidden" name="quickpay-form" value="shop">
<input type="hidden" name="targets" value="Купить 100 токенов">
<input type="hidden" name="sum" value="100" data-type="number">
<input type="hidden" name="successURL" value="https://gayroom.ru">
<label><input type="radio" name="paymentType" value="PC">Яндекс.Деньгами</label>
<label><input type="radio" name="paymentType" value="AC">Банковской картой</label>
<input type="submit" value="Перевести"> 
</form>
</main>
<!-- {js_help(['/js/profiles.js'])} -->
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={token};
