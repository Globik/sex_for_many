// room.js based on busers.js
const onroomstr="Press connect button to broadcast yourself. To stop broadcast press disconnect button. Or you can  just stop video right now.";
const onowneroff="To broadcast yourself please enable your webcam and press start video button.\nThen connect button.";
const usoff="The member you are trying to view is currently offline. Please wait or choose another member to view.";
const you_ban="You are banned.";
const us_ban="This user is banned.";
const str_langsam_stop="We are sorry, but no more activity is acceptable. Site is closing for a profilactic works in a pair of hours.";
const str_emergency_stop="Emergency stop all activities on this site. We are sorry";
const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer'),
	login_proto=require('./login_proto.js');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;

const room = n=>{
let {model,showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${html_head.html_head({title:model.name?model.name:'no_name',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css","/css/login2.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser,mainmenu,profiler})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"> 

<h4>Donate some bitcoins:</h4>
<section>
<a class="btc-img-a" style="" href="bitcoin:a33yhX82ob8kawDdRmW9xAwcoqxrjuKS8SQ">
<div id="imgher" style="">
<img src="donatebutton.jpg" height="100px"></div></a> 
<div id="btcInfo" style="">
<span><b>BTC address for donations:</b></span>
<span style="">a33yhX82ob8kawDdRmW9xAwcoqxrjuKS8SQ</span></div>
</section>

<section id="media-wrapper">
<div id="mediaPanel"><div id="online-detector" class="puls"></div>&nbsp;&nbsp;<b>viewers:&nbsp;</b><span id="rviewers">0</span></div>
<section id="video-container">
<div id="btccount"><span id="btcc">3000</span>&nbsp;<span id="btcspan">bitcoins</span></div>


<div id="video-wrapper">
<video id="localVideo" poster="" autoplay>no video supported</video>
</div>
<div id="under-video">
<button id="btnStart" class="btn-start" onclick="do_start(this);">start</button>

</div>
</section>
<section id="chat-container"><div id="chatPanel">chat <b>users: </b><span id="chatcnt">0</span></div>
<div id="chat"></div>
<div id="under-chat">
<input id="chatTxt" class="chat-txt" type="text" placeholder="your message" maxlength="200"><button class="btn-send" onclick="send_up();">send</button>
</div>
</section>
</section>
<div style="clear:both;"></div> 
<div class="btc-footer" style="">

<div id="btc-container" style="">
<label class="btc-label" style="">Enter your btc address:&nbsp;</label>
<input class="btc-input" style="" type="text" value="a33yhX82ob8kawDdRmW9xAwcoqxrjuKS8SQ"/>
<button class="btn-save" style="">save</button>
</div>

</div>
${js_help(["/js/video_chat_janus.js"])}



{js_help(["/js/video_chat2.js","/js/login.js"])}
{js_help(["/js/admin_videochat.js"])}

</main><footer id="footer">${html_footer.html_footer({})}</footer>
</body>
</html>`;
}
module.exports={room};
