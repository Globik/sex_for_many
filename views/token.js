const html_head = require('./html_head.js');
const html_nav_menu = require('./html_nav_menu.js');
const vert_menu = require('./vert_menu.js');
const html_admin_nav_menu = require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
//const {js_help} = require('../libs/helper.js');
const {site_domain, one_token_btc, yandex_pay} = require('../config/app.json');
let token = function(n){
const buser = n.user;

return `<!DOCTYPE html><html lang="en"><!-- token.js -->
<head>${html_head.html_head({title:`${buser.lng == 'ru'? 'Купить токены' : 'Tokens purchase'}`,
 csslink:"/css/main2.css", cssl:["/css/token.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
${n.btc_pay ? `
${yandex_pay ? `
<h1>${buser&&buser.lng=='ru'? 'Купить токены рублями' : 'Purchase tokens in rubles'}</h1>
<h4>${buser&&buser.lng=='ru'? '100 токенов = 3000 рублей.' : '100 tokens = 3000 rubles'}</h4>
<!-- https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage -->
<form method="POST" name="yandexform" action="https://money.yandex.ru/quickpay/confirm.xml">
<input type="hidden" name="receiver" value="4100115502427578">
<input type="hidden" name="formcomment" value="${buser.lng=='ru'? 'Покупка токенов' :'Tokens purchase'}">
<input type="hidden" name="short-dest" value="${buser.lng=='ru'? 'Покупка токенов' : 'Tokens purchase'}">
<input type="hidden" name="label" value="${buser?buser.bname:'anonym'}">
<input type="hidden" name="quickpay-form" value="shop">
<input type="hidden" name="targets" value="${buser.lng=='ru'? 'Купить 100 токенов' : 'Purchase 100 tokens'}">
<input type="hidden" name="sum" value="2" data-type="number"><!-- 100*30=3000 rubles -->
<input type="hidden" name="successURL" value="https://${site_domain}">
<div>
<div><label class="cntlb"><b>Яндекс.Деньгами</b><input type="radio" name="paymentType" value="PC"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>${buser.lng=='ru'? 'Банковской картой' : 'Bank card'}</b><input type="radio" name="paymentType" checked value="AC"><span class="mark"></span></label></div>
</div><div>
<input type="submit" value="${buser.lng=='ru'? 'Купить' : 'Purchase'}"></div>
</form><hr>` : ''}
<h1>${buser.lng=='ru'? 'Купить токены биткоинами' : 'Purchase tokens in bitcoins'}</h1>
<form name="fbtc" method="post" action="/api/get_bitaps_invoice_2">
<div><label class="cntlb"><b>10 ${buser.lng == 'ru'? 'токенов' : 'tokens'} = 0.008 BTC</b><input type="radio" name="sbtc" checked value="10"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>20 ${buser.lng == 'ru'? 'токенов' : 'tokens'} = 0.016 BTC</b><input type="radio" name="sbtc" value="20"><span class="mark"></span></label></div>
<div><label class="cntlb"><b>50 ${buser.lng == 'ru'? 'токенов' : 'tokens'} = 0.04 BTC</b><input type="radio" name="sbtc" value="50"><span class="mark"></span></label></div>
<input type="hidden" id="BUSERID" name="user_id" value="${buser.id}">
<input type="hidden" name="bname" value="${buser.bname}">
<div><input type="submit" value="${buser.lng == 'ru'? 'Купить' : 'Purchase'}"></div>
</form>
`:'<span style="color:red;">SERVICE TEMPORARILY UNAVAILABLE. PLEASE TRY AGAIN LATER.</span>'}

<!-- </div> -->
${buser && buser.brole == 'superadmin' ? `<div><button data-usid="${buser.id}" onclick="test_tok(this);">test cb</button></div>`:''}
<a href="#" class="overlay" id="setBTCAddress" onclick="in_rem_hash();"></a>
<div id="BTCAddressPop" class="popi">
 <div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div> 
<div id="BTCAddressContainer"><h3 id="erfolgBTC">BTC Address</h3>
<div>${buser.lng == 'ru'? 'Произведите платеж <span id="btcamount"></span> BTC за <span id="tokamount"></span> токенов по этому адресу:' : 'Please make a payment <span id="btcamount"></span> BTC for <span id="tokamount"></span> with this payment address:'}</div>
<div><span id="btcadrspan"></span></div>
<div><span id="btchref"></span></div>
<div id="qrcode"></div>
<div>${buser.lng == 'ru'? 'Пожалуйста, не покидайте страницу в течении 10 минут и дождитесь первого подтверждения платежа.' : 'Please stand by and wait for a first confirmation of payment.'}</div>
<div><a id="hrefHome" href="/">${buser.lng == 'ru'? 'Или вернуться на главную' : 'Or back to home'}</a></div>
<div>${buser.lng == 'ru'? `Не стоит переводить биткоинов меньше чем ${one_token_btc} BTC! В противном случае сумма будет считаться пожертвованием.` : `Please don't send less than ${one_token_btc} bitcoins! Otherwise this sum will be considered as a donation.`}</div>
</div>
</div>
</main>
<script src="/js/qrcode.min.js"></script>
<script src="/js/token.js"></script>
<footer id="footer">${html_footer.html_footer(n)}</footer></body></html>`;
}
module.exports={token};
