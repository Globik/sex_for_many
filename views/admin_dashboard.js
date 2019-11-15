//admin_dashboard.js
const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;


let admin_dashboard=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Dashboard", csslink:"/css/main2.css"})}
<style>
.is_test_btc{background:lightgreen;}
.red{color:red;}
</style>
</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
hallo ${buser.bname}<br>

<br><hr>
<label>If btc pay enabled? <span id="btc_enabled_span">${n.btc_pay}</span></label><br>
<input id="btcPayInput" type="checkbox" ${n.btc_pay?"checked":""} onchange="is_btc_enabled(this);">
<hr>
<label>If test btc? <span id="btc_test">${n.is_test_btc}</span></label><br>
<input type="checkbox" ${n.is_test_btc?"checked":""} onchange="set_btc_pay(this);">
<hr>
<div id="div_test_btc" class="${n.is_test_btc?'is_test_btc':''}">
<label id="lbtctest">Your test btc address:</label><br>
<!-- 
real BTC
1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy
-->
<!-- tBTC mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE -->
<input id="test_btc_address" type="text" maxlength="35" spellcheck="false" autocomplete="off" 
value="${n.test_btc_address?n.test_btc_address:''}" placeholder="your test btc address">
<button id="saveTestBtcBtn" ${n.test_btc_address?'disabled':''}>save</button><button onclick="reset_test_btc_adr();">reset</button>
</div><hr>
<div id="div_real_btc" class="${n.is_test_btc?'':'is_test_btc'}">
<label id="lbtcreal">Your real btc address:</label><br>
<input id="btc_address" type="text" maxlength="35" spellcheck="false" autocomplete="off" placeholder="your btc address"
value="${n.btc_address?n.btc_address:''}">
<button id="saveBtcBtn" ${n.btc_address?'disabled':''}>save</button> <button onclick="reset_btc_adr();">reset</button>
</div>
<br><label id="lproz">your procent:</label><br><input id="btc_procent" value="${n.btc_percent?n.btc_percent:10}" placeholder="10" type="text">%

</main>
${js_help(["/js/adm_btc_pay.js"])}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}

module.exports={admin_dashboard};
