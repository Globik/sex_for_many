const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;

let profile=n=>{
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
<h3>Profile</h3>
</main>
<!-- {js_help(["/js/adm_btc_pay.js"])} -->
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={profile};
