// room.js based on busers.js
//const owner_start_str_en="Press connect button to broadcast yourself. To stop broadcast press disconnect button. Or you can  just stop video right now.";
const owner_start_str_en="To broadcast yourself please enable your webcam and press 'start' button";
const owner_offline_str_en="The member you are trying to view is currently offline. Please wait or choose another member to view.";
const owner_online_str_en="Press start"
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
let {model}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${html_head.html_head({title:model?model.bname:'no_name',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css","/css/login2.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id//="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"> 
${n.owner?
`<div class="btc-footer" style="background:yellow;">
<button onclick="test_cb();">test callback</button>
<h5>Before you start</h5>
<div id="btc-container">
<label id="bInput">Enter your ${n.is_test_btc?'test':''} btc address for donation (optional):</label><br>
<input id="btcInput" class="btc-input" type="text" 
value="${n.is_test_btc?model.cadrtest !==null?model.cadrtest:'':model.cadr !==null?model.cadr:''}" 
maxlength="35" spellcheck="false" autocomplete="off" placeholder="your ${n.is_test_btc?'test':''} btc address"/>
<button ${(model.cadrtest !==null && model.cadr !==null) ?'disabled':''} id="btnSaveAdr" 
class="btn-save" onclick="saveBTC(this);">save</button><button class="btn-save" onclick="reset_btc();">edit</button>

</div></div>`:'<div id="qrcode"></div>'}



${n.owner?'':`<div id="btcInfo" style="">
<span><b>BTC address for donations:</b></span>
<span style="">${n.is_test_btc && model ? model.padrtest:model?model.padr:''}</span></div>`}


<section id="media-wrapper">
<div id="mediaPanel"><div id="online-detector" class=""></div>&nbsp;&nbsp;<b>viewers:&nbsp;</b><span id="rviewers">0</span></div>
<section id="video-container">
<div id="btccount"><span id="btcc">${model.btc_all}</span>&nbsp;<span id="btcspan">satoshi</span></div>


<div id="video-wrapper" class="${n.owner?'':n.model && n.model.src?'owner-online':'owner-offline'}"
data-ownerStartStrEn="${owner_start_str_en}" 
data-ownerOfflineStrEn="${owner_offline_str_en}"
data-ownerOnline="${owner_online_str_en}">
<video id="localVideo" poster="${model && model.src?model.src:''}" autoplay>no video supported</video>


</div>
<div id="under-video">
<button id="btnStart" class="btn-start" onclick="do_start(this);">start</button>
<a href="bitcoin:${n.is_test_btc? model.padrtest:model.padr}">
<img id="btnDonate" src="/images/bitcoin-button.png-bitcoin-button.png"></a>
</div>
</section>
<section id="chat-container"><div id="chatPanel"><b>chat: </b><span id="chatcnt">0</span></div>
<div id="chat"></div>
<div id="under-chat">
<input id="chatTxt"  class="chat-txt" type="text" placeholder="your message" maxlength="200"><button class="btn-send" onclick="send_up();">send</button>
</div>
</section>
</section>
<div style="clear:both;"></div> 


<input type="hidden" id="owner" value="${n.owner}">
<input type="hidden" id="buser" value="${buser?true:false}">
<input type="hidden" id="yourNick" value="${buser ? buser.bname:'anonym'}">

<input type="hidden" id="modelName" value="${model?model.bname:''}">
<input type="hidden" id="modelId" value="${model?model.id:''}">
<input type="hidden" id="invoici" value="${model.inv !==null?model.inv:''}">
${js_help(["/js/adapter-latest.js","/js/video_chat_janus.js","/js/qrcode.min.js"])}

</main><footer id="footer">${html_footer.html_footer({})}</footer>
<!-- github.com/zhiyuan-l/qrcodejs -->
<script>${!n.owner?`new QRCode(gid("qrcode"),{
text:"${n.is_test_btc?model.padrtest !==null?model.padrtest:'figu':model.padr !==null?model.padr:'dura'}",
width:128,height:128,border:4,});`:''}</script>
</body>
</html>`;
}
module.exports={room};
