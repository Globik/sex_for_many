const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;
const owner_start_str_en="To broadcast yourself please enable your webcam and press 'start' button";
const owner_offline_str_en="В настоящее время юзер оффлайн. Пожалуйста подождите или выберете другого юзера.";
const owner_online_str_en="Press start"
const you_ban="You are banned.";
const us_ban="This user is banned.";
const str_langsam_stop="We are sorry, but no more activity is acceptable. Site is closing for a profilactic works in a pair of hours.";
const str_emergency_stop="Emergency stop all activities on this site. We are sorry";

const chat_room = n=>{
let {model}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:model?model.bname:'no_name',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"><h2>Комната ${model?model.bname:'Анон'}</h2>
${n.owner?
`<div class="btc-footer" style="background:yellow;">
<!-- <button onclick="test_cb();">test callback</button> -->
<h5>Прежде чем начать</h5>
<div id="btc-container">
<label id="bInput">Введите свой ${n.is_test_btc?'test':''} btc адрес для донатов (необязательно):</label><br>
<input id="btcInput" class="btc-input" type="text" 
value="${n.is_test_btc?model.cadrtest !==null?model.cadrtest:'':model.cadr !==null?model.cadr:''}" 
maxlength="35" spellcheck="false" autocomplete="off" placeholder="your ${n.is_test_btc?'test':''} btc address"/>
<button ${(model.cadrtest !==null && model.cadr !==null) ?'disabled':''} id="btnSaveAdr" 
class="btn-saveL" onclick="saveBTC(this);">сохранить</button><button class="btn-saveL" onclick="reset_btc();">редактировать</button>
</div></div>`:''}



${n.owner?'':model.padrtest || model.padr?`<div id="btcInfo" style="">
<span><b>Биткоин адрес для донатов:</b></span>
<span style="">${n.is_test_btc && model ? model.padrtest:model?model.padr:''}</span></div>`:''}


<section id="media-wrapper">
<div id="mediaPanel"><div id="online-detector" class=""></div>
<!-- &nbsp;&nbsp;<b>viewers:&nbsp;</b><span id="rviewers">0</span>-->
<div id="btccount"><span id="btcc">${model.btc_all}</span>&nbsp;<span id="btcspan">satoshi</span></div>
</div>
<section id="video-container">
<!-- <div id="btccount"><span id="btcc">${model.btc_all}</span>&nbsp;<span id="btcspan">satoshi</span></div> -->


<div id="video-wrapper" class="${n.owner?'':n.model && n.model.src?'owner-online':'owner-offline'}"
data-ownerStartStrEn="${owner_start_str_en}" 
data-ownerOfflineStrEn="${owner_offline_str_en}"
data-ownerOnline="${owner_online_str_en}">
<video id="remoteVideo" autoplay></video>
<video id="localVideo" poster="${model && model.src?model.src:''}" autoplay>no video supported</video>
</div>
<div id="under-video">
<!-- <button id="btnStart" class="btn-start" onclick="${n.owner?'snapshot();':'do_start(this);'}">${n.owner?'snapshot':'позвонить'}</button>
<button id="btnCancell" class="btn-start" onclick="cancel_video(this);">стоп</button> -->
${n.owner?'': model.padrtest || model.padr? `<a href="bitcoin:${n.is_test_btc? model.padrtest:model.padr}">
<img id="btnDonate" src="/images/bitcoin-button.png-bitcoin-button.png"></a>`:''}
</div>
<div id="under-video2">
<button id="btnStart" class="btn-start" onclick="${n.owner?'snapshot();':'do_start(this);'}">${n.owner?'snapshot':'позвонить'}</button>
<button id="btnCancell" class="btn-start" onclick="cancel_video(this);">стоп</button>
</div>
</section>
<section id="chat-container"><div id="chatPanel"><b>чат: </b><span id="chatcnt">0</span>&nbsp;<button id="btnFoto" onclick="insert_img();" title="вставить фотографию">фото</button></div>
<div id="chat"></div>
<div id="under-chat">
<input id="chatTxt"  class="chat-txt" type="text" placeholder="ваше сообщение" maxlength="200"></div>
<div><button id="vasja" onclick="send_up();">оправить</button></div>

</section>

</section>
 <div style="clear:both;"></div>  

<h4>Профиль</h4>
<div id="clientFoto"></div>
<ul id="profileUl">
<li><b>Имя: </b><span id="clientName"></span>
<li><b>Возраст: </b><span id="clientAge"></span>
<li><b>О себе: </b><br><span id="clientMsg"></span>
${n.owner?'':'<header>Биткоин адрес:</header><div id="qrcode"></div>'}
<li><a href="/home/profile/${model?model.bname:''}">редактировать</a>
</ul>
<output id="webrtc"></output>
<input type="hidden" id="owner" value="${n.owner}">
<input type="hidden" id="buser" value="${buser?true:false}">
<input type="hidden" id="yourNick" value="${buser ? buser.bname:'Anon'}">

<input type="hidden" id="modelName" value="${model?model.bname:''}">
<input type="hidden" id="modelId" value="${model?model.id:''}">
<!-- <input type="hidden" id="invoici" value="${model.inv !==null?model.inv:''}"> -->
${js_help(["/js/chat_room.js","/js/qrcode.min.js"])}
<a href="#." class="overlay" id="insImg"></a>
<div id="setImg" class="popi">
<div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div>
<div id="pizda1">
<label for="forImg">Введите адрес картинки.</label><br><br>
<input id="forImg" type="text" placeholder="адрес фото"/>
<br><button onclick="send_ws_img();">Отправить</button>
</div>
</div>
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
<!-- github.com/zhiyuan-l/qrcodejs -->
<script>${!n.owner? model.padrtest || model.padr? `new QRCode(gid("qrcode"),{
text:"${n.is_test_btc?model.padrtest !==null?model.padrtest:'': model.padr !==null?model.padr:''}",
width:128,height:128,border:4,});`:'':''}</script>
</body>
</html>`;
}
module.exports={chat_room};
/*
 for trigger
 delete from chat where tz=(select min(tz) from chat where us_id=1); -- if count == lim
 select tz from chat where us_id=1 limit 3; 
 delete from chat where //us_id=1\\ and tz in (select tz from chat where us_id=1 limit 3); --if count > lim
 */ 
