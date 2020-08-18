const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
   const moment=require('moment');
   const {get_banner, get_banner_podval}=require('./reklama_s');
   const doska=require('./doska');
   const vert_menu=require('./vert_menu.js');
   
   const {people} = require('./people');
const {js_help}=require('../libs/helper.js');
const owner_str = "В любой момент может поступить видеозвонок. Будьте готовы.";
const notowner_str = "Вы можете позвонить юзеру. Нажмите на кнопку 'видеозвонок'";
//const owner_online_str_en="Press start"
//const you_ban="You are banned.";
//const us_ban="This user is banned.";
const str_langsam_stop="We are sorry, but no more activity is acceptable. Site is closing for a profilactic works in a pair of hours.";
const str_emergency_stop="Emergency stop all activities on this site. We are sorry";
const chat_room = n=>{
let {model}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:model?model.bname:'-', meta: get_meta(n.meta, model),
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css"],luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}
<main id="pagewrap">
${vert_menu.vert_menu({})}
<div id="right">
<h2>Комната ${model?model.bname:'Анон'}</h2>${n.descr?`<p>${n.descr}</p>`:''}
${n.owner?
`<div class="btc-footer">
<!-- <button onclick="test_cb();">test callback</button> -->

<h5>Прежде чем начать</h5>
<div id="btc-container">
<label id="bInput">Введите свой ${n.is_test_btc?'test':''} <b>биткоин адрес</b> для донатов (<a href="/basa">где взять?</a>):</label><br>
<input id="btcInput" class="btc-input" type="text" 
value="${n.is_test_btc?model.cadrtest !==null?model.cadrtest:'':model.cadr !==null?model.cadr:''}" 
maxlength="35" spellcheck="false" autocomplete="off" placeholder="your ${n.is_test_btc?'test':''} btc address"/>
<button ${(model.cadrtest !==null && model.cadr !==null) ?'disabled':''} id="btnSaveAdr" 
class="btn-saveL" onclick="saveBTC(this);">сохранить</button>&nbsp;<button class="btn-saveL" onclick="reset_btc();">редактировать</button>
</div></div><div><label for="roomdescr">Добавьте описание стрима:</label><br><input type="text" id="roomdescr" maxlength="200"></div>`:''}

${n.owner?'':model.padrtest || model.padr?`<div id="btcInfo" style="">
<span><b>Послать биткоины на адрес:</b></span>
<span style="">${n.is_test_btc && model ? model.padrtest:model?model.padr:''}</span></div>`:''}
<!-- <video src="/vid/sveta.webm" style="border:2px solid red;" autoplay></video>
ffmpeg -i marina.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus marina.webm -->
<section id="media-wrapper">
<div id="mediaPanel"><!-- <div id="online-detector" class=""></div> -->
<!-- &nbsp;&nbsp;<b>viewers:&nbsp;</b><span id="rviewers">0</span>-->
<div id="tokencount"><span id="tokencc">0</span>&nbsp;<span id="tokenspan">токенов</span></div>
<div id="btccount"><span id="btcc">${model.btc_all?model.btc_all:0}</span>&nbsp;<span id="btcspan">сатоши</span></div>
</div>
<section id="video-container">


<div id="video-wrapper" class="${n.owner?'owner':'notowner'}"
data-owner="${owner_str}" data-notowner="${notowner_str}">
<video id="remoteVideo" muted autoplay></video>
<video id="localVideo" muted autoplay></video>
</div>
<div id="under-video">
${n.owner?'': model.padrtest || model.padr? `<a href="bitcoin:${n.is_test_btc? model.padrtest:model.padr}">
<img id="btnDonate" src="/images/bitcoin-button.png-bitcoin-button.png"></a>`:''}
</div>

<div id="under-video2">

<div id="privatcontainer" class="">
<div id="privatpanel"><span onclick="on_span();">приватчат</span></div>
<div id="privatchat"></div>
<input id="privatinput" type="text" placeholder="Приват сообщение">
</div>
<button id="dopPanelbtn" class="btn-start" title="Настройки" onclick="dopPanel_out(this);">||</button>
${n.owner?`<button id="webcamStart" onclick="start_webCamera(this);">Веб камера</button>
<button id="vStreamStart" disabled onclick="start_stream(this);">Старт стрим</button>`:`<button class="btn-start" onclick="give_token();">Дать на чай</button>
<button class="btn-start" onclick="popa();">звук</button><button class="btn-start">Приват</button>`}
<!-- <button id="btnCancell" class="btn-start" onclick="cancel_video(this);">стоп</button> -->
<div id="dopPanel">

${n.owner?`<label class="label-galka"><span>Сохранить видео</span><input id="ifRecord" type="checkbox"/><span class="galka"></span></label>
<button id="btnStart" class="btn-start" onclick="snapshot();">сделать снимок</button>`:''}
<!-- mute / unmute the sound -->
</div>
</div>

</section>

<section id="chat-container"><div id="chatPanel"><div><b>В&nbsp;чатe&nbsp;</b><span id="chatcnt">0</span>&nbsp;чел.</div></div>
<div id="chat"></div>
<div id="under-chat">
<textarea id="chatTxt"  class="chat-txt" type="text" placeholder="ваше сообщение" maxlength="200"></textarea>
</div>
<div id="under-chat2">
<button id="btnFoto" onclick="insert_img();" title="вставить фотографию">вставить фото</button>
<button id="vasja" onclick="send_up(this);">отправить</button>
</div>

</section>

</section>
 <div style="clear:both;"></div>  
<!--
<h4>Профиль</h4>
<div id="clientFoto"></div>
<ul id="profileUl">
<li><b>Имя: </b><span id="clientName"></span>
<li><b>Город: </b><span id="clientCity"></span>
<li><b>Ориентация: </b><span id="clientOrientation"></span>
<li><b>Возраст: </b><span id="clientAge"></span>
<li><b>О себе: </b><br><span id="clientMsg"></span>
<li> --><br><b>Просмотров: </b><span id="clientViews"></span>
${n.owner?'':'<br><div id="qrcodeContainer"><header>Биткоин адрес:</header><div id="qrcode"></div></div>'}
<!-- {n.owner?'<li><a href="/home/profile/{model.bname}">редактировать</a>':''} -->
</ul>
<hr>
${doska.doska({})}
${buser && buser.brole=='superadmin'? `<hr>${people({})}`:''}
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
<output id="webrtc"></output>
<input type="hidden" id="owner" value="${n.owner}">
<input type="hidden" id="buser" value="${buser?true:false}">
<input type="hidden" id="yourNick" value="${buser ? buser.bname:'Anon'}">

<input type="hidden" id="isfake" value="${model&&model.brole=='fake'?true:false}">
<input type="hidden" id="fakesrc" value="${n.videos?n.videos.src:''}">

<input type="hidden" id="modelName" value="${model?model.bname:''}">
<input type="hidden" id="modelId" value="${model?model.id:''}">
<input type="hidden" id="xirTarget" value='${n.xirsys?JSON.stringify(n.xirsys):''}'>
<input type="hidden" id="invoici" value="${model.inv !==null?model.inv:''}">
<input type="hidden" id="devTarget" value="${process.env.DEVELOPMENT=='yes'?'y':'n'}">



<a href="#" class="overlay" id="insImg"></a>
<div id="setImg" class="popi">
<div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div>
<div id="pizda1">
<label for="forImg">Введите адрес картинки.</label><br><br>
<input id="forImg" type="text" placeholder="адрес фото"/>
<br><br><br><button onclick="send_ws_img();">Отправить</button>
</div>
</div>

</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
${js_help(["/js/adapter-latest.js","/js/chat_room.js","/js/qrcode.min.js"])}
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
 
function get_meta(n, model){
let s='';
s+=`
<meta property="og:locale" content="ru_RU" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${n.url}" />
<meta property="og:image" content="${n.image}" />
<meta property="og:title" content="Чат комната ${model?model.bname:''}." />
<meta property="og:description" content="${n.main_page.description}" />

<meta property="og:site_name" content="gayroom"/>
<meta itemprop="name" content="Чат комната ${model?model.bname:''}." />
<meta itemprop="description" content="${n.main_page.description}" />`
return s;
}
function get_videos(n,l){
let s='';
n.forEach(function(el,i){
s+=`<div class="videodiv" data-id="${el.id}" data-at="${el.cr_at}">
<div><span><a href="/webrtc/${el.usid}">${el.nick}</a></span>&nbsp;<span>${moment(el.cr_at).format('DD-MM-YYYY')}</span>&nbsp;
<span>Просмотров: </span><span>${el.v}</span></div>
<video data-vid="${el.id}" src="/vid/${el.src}" controls onplay="vplay(this);"></video>
<div>${l.owner?`<button data-bid="${el.id}" data-src="${el.src}" onclick="del_video(this);">Удалить</button>`:''}</div>
</div>`;	
})	
return s;
}
