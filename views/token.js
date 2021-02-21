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
<h1>Купить токены рублями</h1>
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
<div><label class="cntlb"><b>Яндекс.Деньгами</b><input type="radio" name="paymentType" value="PC"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>Банковской картой</b><input type="radio" name="paymentType" checked value="AC"><span class="mark"></span></label></div>
</div><div>
<input type="submit" value="Купить"></div>
</form>
<hr><h1>Купить токены биткоинами</h1>
<form name="fbtc" method="post" action="/api/get_bitaps_invoice_2">
<div><label class="cntlb"><b>10 токенов = 0.008 BTC</b><input type="radio" name="sbtc" checked value="10"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>20 токенов = 0.016 BTC</b><input type="radio" name="sbtc" value="20"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>50 токенов = 0.04 BTC</b><input type="radio" name="sbtc" value="50"><span class="mark"></span></label></div>
<input type="hidden"  name="user_id" value="${buser.id}">
<input type="hidden" name="bname" value="${buser.bname}">
<div><input type="submit" value="Купить"></div>
</form>
</div>
<div id="qrcode"></div>
<a href="#" class="overlay" id="setBTCAddress" onclick="in_rem_hash();"></a>
<div id="BTCAddressPop" class="popi">
 <div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div> 
<div id="BTCAddressContainer"><h3>BTC Address</h3>
<div>Произведите платеж <span id="btcamount"></span> BTC за <span id="tokamount"></span> токенов по этому адресу:</div>
<div><span id="btcadrspan"></span></div>
<div><span id="btchref"></span></div>
<!-- <div id="qrcode"></div> -->
<div>Пожалуйста, не покидайте страницу в течении 10 минут и дождитесь первого подтверждения платежа.</div>
<div><a id="hrefHome" href="/">Или вернуться на главную</a></div>
<div>Не стоит переводить биткоинов меньше чем 0.0008 BTC. В противном случае сумма будет считаться пожертвованием.</div>
</div>
</div>
</main>
<script src="/js/qrcode.min.js"></script>
<script src="/js/token.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}
module.exports={token};
