const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;

const chat_room = n=>{
let {model}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${html_head.html_head({title:model?model.bname:'no_name',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"> <h2>chat</h2>
<button onclick="boo();">get ice servers</button>
${js_help(["/js/chat_room.js","/js/qrcode.min.js"])}

</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
<!-- github.com/zhiyuan-l/qrcodejs -->
<script>${!n.owner?`new QRCode(gid("qrcode"),{
text:"${n.is_test_btc?model.padrtest !==null?model.padrtest:'figu':model.padr !==null?model.padr:'dura'}",
width:128,height:128,border:4,});`:''}</script>
</body>
</html>`;
}
module.exports={chat_room};
