const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
   const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
const xirsys = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- xirsys.js -->
<head>${html_head.html_head({title:'turn сервер',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/xirsys.css"]})}
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right"><h2>turn сервер</h2>
<div id="xir" class="${n.xirsys?'stable':'momentan'}">${n.xirsys?JSON.stringify(n.xirsys):'Нет пока.'}</div>
<br><br><button onclick="get_xirsys(this);">Взять сервера</button>&nbsp;|&nbsp;<button onclick="set_xirsys(this);">Сохранить сервера</button>
<hr><button onclick="get_subscribe();">subscribe push notifications</button></div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
${js_help(["/js/xirsys.js"])}
</body>
</html>`;
}
module.exports={xirsys};
