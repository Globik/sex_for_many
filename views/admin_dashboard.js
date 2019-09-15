//admin_dashboard.js
const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
var warnig=false;	  
var haupt_ban=false;


let admin_dashboard=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Dashboard", csslink:"/css/main2.css"})}
<style>
.is_test_btc{background:lightgreen;}
</style>
</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
hallo ${buser.bname}<br>

<li><a href="/dashboard/banners">banners</a>

<br><hr>
<label>If btc pay enabled? <span id="btc_enabled">${n.btc_pay}</span></label><br>
<input type="checkbox" ${n.btc_pay?"checked":""} onchange="is_btc_enabled(this);">
<hr>
<label>If test btc? <span id="btc_test">${n.is_test_btc}</span></label><br>
<input type="checkbox" ${n.is_test_btc?"checked":""} onchange="set_btc_pay(this);">
<hr>
<div id="div_test_btc" class="${n.is_test_btc?'is_test_btc':''}">
<label id="lbtc">Your test btc address:</label><br>
<input id="test_btc_address" type="text" maxlength="34" spellcheck="false" autocomplete="off" placeholder="your test btc address">
<button onclick="save_test_btc();">save</button><button onclick="reset_test_btc_adr();">reset</button>
</div><hr>
<div id="div_real_btc" class="${n.is_test_btc?'':'is_test_btc'}">
<label id="lbtcreal">Your real btc address:</label><br>
<input id="btc_address" type="text" maxlength="34" spellcheck="false" autocomplete="off" placeholder="your btc address">
<button onclick="save_btc();">save</button> <button onclick="reset_btc_adr();">reset</button>
</div>
<br><label id="lproz">your procent:</label><br><input id="btc_procent" value="10" placeholder="10" type="text">%
<script>
function is_btc_enabled(el){
let data={};
data.hi="hi";
vax("post","/home/profile/enable_btc", data, on_enable_btc, onerror, null, false);	
}

function onerror(l){alert('error'+l);}
function on_enable_btc(l){
console.log(l);
btc_enabled.textContent=l.btc_pay;
}
function set_btc_pay(el){
let data={};
data.hi="hi";
vax("post","/home/profile/btc_test",data, on_test_btc, onerror, null,false);
}
function on_test_btc(l){
console.log(l);
btc_test.textContent=l.is_test_btc;
if(l.is_test_btc){
div_test_btc.className="is_test_btc";
div_real_btc.className="";
}else{
div_test_btc.className="";
div_real_btc.className="is_test_btc";
}
}

function save_test_btc(){
if(!test_btc_address.value){
let span=crel("span","\tNo btc address provided!","red");
insert_after(span, lbtc,"span")
return;
}
if(!btc_procent.value){
let span=crel("span","\tNo procent provided!","red");
insert_after(span, lproz,"span")
return;
}
del_after(lbtc,"span");
del_after(lproz,"span");
let data={};
//data
}

function reset_test_btc_adr(){
test_btc_address.value="";
del_after(lbtc,"span");
}

function save_btc(){
if(!btc_address.value){
let span=crel("span","\tNo btc address provided!","red");
insert_after(span, lbtcreal,"span")
return;
}
if(!btc_procent.value){
let span=crel("span","\tNo procent provided!","red");
insert_after(span, lproz,"span")
return;
}
del_after(lbtcreal,"span");
del_after(lproz,"span");
let data={};

}
function reset_btc_adr(){
btc_address.value="";
del_after(lbtcreal,"span");
del_after(lproz,"span");
}
</script>
</main><footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}

module.exports={admin_dashboard};
