const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;
const fake_room=function(n){
const {lusers,showmodule:{mainmenu,profiler}}=n;
const buser=n.user,roomers=n.roomers;
return `<!DOCTYPE html><html lang="en">
<head>
<head>${html_head.html_head({title:"room",csslink:"/css/main2.css",luser:buser})}</head>
<!-- 
TODO meta names
<meta charset="utf-8"><title>websocket</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> -->
</head>

<body>
${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser,mainmenu:mainmenu,profiler:profiler})}</nav>
${haupt_ban ?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap"> 
<h3>websocket</h3>
<b>username: </b><span id="username">${n.model?n.model.name:'no_name'}</span><br>
<input type="text" id="chatxt" placeholder="your message"/><button onclick="send();">send</button>
<button onclick="test_cb();">test cb</button>
<!--enctype="multipart/form-data" -->
<form action="/api/savebtcaddress" name="btcForm" method="post" >
<label for="btctxt">Enter your BTC address:</label>
<input type="text" id="btctxt" name="btcadr" maxlength="34" spellcheck="false" value="mi1BYcC463rVJzrbaApLVKSR9bVtGHVDbp"
 placeholder="btc address"/>
<input type="hidden" name="username" value="${buser && buser.bname?buser.bname:""}"/>
<input name="reset" type="Reset"/>
<input type="submit" value="save"/>
</form>
<br><a id="publicbtc" href=""></a><br>
<b>output:</b><br>
<output id="out"></output>
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
${js_help(["/js/videoroom.js"])}
</body></html>`;	
}
module.exports={fake_room};
