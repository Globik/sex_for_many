
const html_head = require('./html_head'),
    html_nav_menu = require('./html_nav_menu'),
	html_admin_nav_menu = require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
   const moment = require('moment');
   const {get_banner, get_banner_podval} = require('./reklama_s');
   const {AFTER_REGISTRATION} = require('../config/mail.js');
   const doska = require('./doska');
   const vert_menu = require('./vert_menu.js');
   
   const {people} = require('./people');
const {js_help} = require('../libs/helper.js');
const owner_str_ru = "Чтобы начать стрим, нажмите на 'веб камера', затем на 'Cтарт стрим'. Чтобы закончить стрим, нажмите на 'Cтоп стрим'.";
const owner_str_en = "To start a stream press 'web camera', then press 'start stream'. To end up the stream press 'Stop stream'";

const webcamowner_str_ru = "Чтобы начать стрим, нажмите на на 'Cтарт стрим'. Чтобы закончить стрим, нажмите на 'Cтоп стрим'.";
const webcamowner_str_en = "to get started a stream press 'Start stream'. To end up the stream press 'Stop stream'.";

const notowner_str_ru = "Привет! Вы можете запросить у меня приват : ) Жми 'Приват'!";
const notowner_str_en = "Hello there! Why not to ask me for a privat? : ) Press 'Privat'!";

const streaminterupt_str_ru = "Конец стрима";
const streaminterupt_str_en = "That's all";
//const owner_online_str_en="Press start"
//const you_ban="You are banned.";
//const us_ban="This user is banned.";
const str_langsam_stop="We are sorry, but no more activity is acceptable. Site is closing for a profilactic works in a pair of hours.";
const str_emergency_stop="Emergency stop all activities on this site. We are sorry";
const chat_room = n=>{
const buser = n.user;
let {model} = n;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:model?model.bname:'-', meta: get_meta(n.meta, model),
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat2.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin' ? html_admin_nav_menu.html_admin_nav_menu(n) : ''}
${n.banner && n.banner.length ? `<div id="haupt-banner">${get_banner(n.banner)}</div>` : ''}
<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
${n.message && n.message.info == 'promo' ? buser ? buser.lng=='ru' ? AFTER_REGISTRATION({}).ru : AFTER_REGISTRATION({}).en : '' : ''}

<h2>${n.user?n.user.lng=='ru'?'Комната':'Room':'Комната'} ${model?model.bname:'Анон'}</h2>
${!n.owner?`<img id="modelava" data-avid="${model.id}" onerror="foto_error(this);" src="${model.ava?model.ava:'/images/unnamed.jpg'}">`:''}
${!n.owner ? `<p>${model.bage},&nbsp;${model.sexor}</p>` : ''}
${!n.owner?`<p>${model.stat?model.stat:''}</p>`:''}
${n.owner?
`<div class="btc-footer">
<!-- <button onclick="test_cb();">test callback</button> -->
<!-- <div>У вас <span id="bitcoinCount">{(model.items*model.proz)/100}</span> рублей. <a href="/userpay/${model.bname}">Посмотреть выплаты.</a></div> -->
<h5>${n.user.lng=='ru'?'Прежде чем начать (необязательно)':'Before to get started (not obligatory)'}</h5>
<div>
<div class="requis">
<div id="avacontainer">
<img id="imgavatar" data-avid="${model.id}" onerror="" src="${model&&model.ava?model.ava:'/images/unnamed.jpg'}">
</div>
</div>
<div class="requis">
<form name="avaprofi" action="/api/save_ava" method="post">
<label for="avfile"><strong>${n.user.lng=='ru'?'Ваш аватар':'Your avatar'}:</strong></label><br>
<input id="avfile" type="file" name="zfile" accept="image/*" onchange="thumb(this.files);" required>
<input type="hidden" name="fname" value="${model?model.bname:''}">
</div>
<div class="requis"><input type="submit" value="${n.user.lng=='ru'?'загрузить':'Upload'}"></div>
</form>

<div>
<div class="requis">
<form name="alterform" method="post" action="/api/save_alter">
<label for="alterid"><strong>${n.user.lng == 'ru' ? 'Сколько вам лет?' : 'How old are you?'}</strong></label><br>
<input id="alterid" name="alter" type="number" min="10" max="100" value="${model.bage == '18' ? '18' : model.bage}" required>&nbsp;&nbsp;
<input type="hidden" name="fname" value="${model?model.bname:''}">
<input type="submit" name="submit" value="${n.user.lng == 'ru' ? 'Сохранить' : 'Save'}">
</form>
</div>
<!-- {JSON.stringify(model)}<br> -->
<div class="requis"><form name="sexform" method="post" action="/api/save_sex">
	<label for="zType"><strong>${n.user.lng == 'ru' ? 'Выберите сексуальную ориентацию' : 'Select your sexuel orientation'}</strong></label><br>
	<select name="sexorient" id="zType" required>
	<option value="hetero" ${model.sexor == 'hetero' ? 'selected' : ''}>${n.user.lng == 'ru' ? 'гетеро' : 'hetero'}</option>
	<option value="gay" ${model.sexor == 'gay' ? 'selected' : ''}>${n.user.lng == 'ru' ? 'гей' : 'gay'}</option>
	<option value="bi" ${model.sexor == 'bi' ? 'selected' : ''}>${n.user.lng == 'ru' ? 'би' : 'bi'}</option>
	<option value="lesbi" ${model.sexor == 'lesbi' ? 'selected' : ''}>${n.user.lng == 'ru' ? 'лесби' : 'lesbi'}</option>
	<option value="trans" ${model.sexor == 'trans' ? 'selected' : ''}>${n.user.lng == 'ru' ? 'транс' : 'trans'}</option>
	</select>
	<input type="hidden" name="fname" value="${model?model.bname:''}">&nbsp;&nbsp;
	<input type="submit" name="submit" value="${n.user.lng == 'ru' ? 'Сохранить' : 'Save'}">
	</form>
	</div>

<div class="requis"><strong><label for="roomdescr">${n.user.lng=='ru'?'Статус':'Status'}:</strong></label><br>
<input type="text" id="roomdescr" maxlength="200" placeholder="${n.user.lng=='ru'?'200 знаков':'200 letters'}" value="${model&&model.stat?model.stat:''}">
</div>
<div><button data-bname="${model?model.bname:''}" onclick="save_status(this);">${n.user.lng=='ru'?'Cохранить':'Save'}</button></div>
</div>
<div class="inwrap3"><label><strong>${n.user.lng=='ru'?'Выберите язык':'Choose a language'}</strong></label></div>
<div class="inpwrap"><label class="cntlb">&nbsp;&nbsp;<b style="color:black;">русский</b><input onchange="change_language(this);" type="radio" name="lang" value="ru" ${n.user.lng=='ru'?'checked':''}><span class="mark"></span></label>
&nbsp;&nbsp;<label class="cntlb">&nbsp;&nbsp;<b style="color:black;">english</b><input onchange="change_language(this);" type="radio" value="en" name="lang" ${n.user.lng=='en'?'checked':''}>
<span class="mark"></span></label></div>
</div>

<div id="btc-container" class="requis">
<label id="bInput">${n.user.lng=='ru'?'Введите свой':'Enter your'} ${n.is_test_btc?'test':''} <b>${n.user.lng=='ru'?'биткоин адрес':'bitcoin address'}</b> ${n.user.lng=='ru'?'для донатов':'for donations'} (<a href="/basa">${n.user.lng=='ru'?'где взять':'where to get'}?</a>):</label><br>
<input id="btcInput" class="btc-input" type="text" 
value="${n.is_test_btc?model.cadrtest !==null?model.cadrtest:'':model.cadr !==null?model.cadr:''}" 
maxlength="35" spellcheck="false" autocomplete="off" placeholder="your ${n.is_test_btc?'test':''} btc address"/>
<button ${(model.cadrtest !==null && model.cadr !==null) ?'disabled':''} id="btnSaveAdr" 
class="btn-saveL" onclick="saveBTC(this);">${n.user.lng=='ru'?'Cохранить':'Save'}</button>&nbsp;<button class="btn-saveL" onclick="reset_btc();">${n.user.lng=='ru'?'редактировать':'Edit'}</button>
</div>`:''}

${n.owner?'':model.padrtest || model.padr?`<div id="btcInfo" style="">
<span>${n.user?n.user.lng=='ru'?'Донаты для ':'Donations for':'Донаты для'} ${model?model.bname:'Анон'} ${n.user?n.user.lng=='ru'?'на биткоин адрес':'to the bitcoin address':'на биткоин адрес'} :</span>
<span><b>${n.is_test_btc && model ? model.padrtest:model?model.padr:''}</b></span></div>`:''}
<!-- <video src="/vid/sveta.webm" style="border:2px solid red;" autoplay></video>
ffmpeg -i vanya.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus vanya.webm -->
<section id="media-wrapper">
<div id="mediaPanel"><!-- <div id="online-detector" class=""></div> -->
<!-- &nbsp;&nbsp;<b>viewers:&nbsp;</b><span id="rviewers">0</span>-->
<div id="tokencount"><span id="tokencc">${model ? model.items: 0}</span>&nbsp;<span id="tokenspan">${n.user?n.user.lng=='ru'?'токенов':'tokens':'токенов'}</span></div>
<div id="btccount"><span id="btcc">${model.btc_all ? model.btc_all: 0}</span>&nbsp;<span id="btcspan">${n.user?n.user.lng=='ru'?'сатоши':'satoshi':'сатоши'}</span></div>
</div>
<section id="video-container">
<div id="video-wrapper" class="${n.owner?'owner':'notowner'}"
data-owner="${n.user?n.user.lng=='ru'?owner_str_ru:owner_str_en:owner_str_ru}"
 data-notowner="${n.user?n.user.lng=='ru'?notowner_str_ru:notowner_str_en:notowner_str_ru}"
  data-streaminterupt="${n.user?n.user.lng == 'ru' ? streaminterupt_str_ru : streaminterupt_str_en : streaminterupt_str_ru}" data-connecting="Connecting..."
 data-webcamowner="${n.user?n.user.lng=='ru'?webcamowner_str_ru:webcamowner_str_en:webcamowner_str_ru}" data-privat="Приват / Privat">
<video id="remoteVideo" muted autoplay></video>
<video id="localVideo" muted autoplay></video>
</div>
<div id="under-video">
<div id="privatcontainer" class="">
<div id="privatpanel"><span onclick="on_span();">${n.user?n.user.lng=='ru'?'приватчат':'privatchat':'приватчат'}</span></div>
<div id="privatchat"></div>
<input id="privatinput" type="text" placeholder="${n.user?n.user.lng=='ru'?'Приват сообщение':'Privat message':'Приват сообщение'}">
</div>
${n.owner?'': model.padrtest || model.padr? `<a href="bitcoin:${n.is_test_btc? model.padrtest:model.padr}">
<img id="btnDonate" src="/images/bitcoin-button.png-bitcoin-button.png"></a>`:''}
</div>

<div id="under-video2">
<!--
<div id="privatcontainer" class="">
<div id="privatpanel"><span onclick="on_span();">приватчат</span></div>
<div id="privatchat"></div>
<input id="privatinput" type="text" placeholder="Приват сообщение">
</div>
-->
<button id="dopPanelbtn" title="Панель / Panel" onclick="dopPanel_out(this);">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z" fill="currentColor" fill-rule="nonzero"/></svg>
</button>${n.owner?`<button id="webcamStart" onclick="start_webCamera(this);" title="webcamera">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.613 18.581m9.387-9.581c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm-2 0c0-1.103-.896-2-2-2s-2 .897-2 2 .896 2 2 2 2-.897 2-2zm-9 0c0 3.86 3.141 7 7 7s7-3.14 7-7-3.141-7-7-7-7 3.14-7 7zm16 0c0 4.97-4.029 9-9 9s-9-4.03-9-9 4.029-9 9-9 9 4.03 9 9zm-.404 12.501c1.007 1.142-.014 2.679-1.448 2.481-1.795-.245-3.236-1.702-7.147-1.702-3.91 0-5.352 1.458-7.146 1.702-1.436.198-2.456-1.34-1.449-2.481l2.898-3.289c.559.388 1.156.725 1.79.994l-2.025 2.298c1.295-.524 3.065-1.225 5.933-1.225s4.638.7 5.933 1.224l-2.025-2.298c.634-.27 1.231-.606 1.79-.994l2.896 3.29z" fill="currentColor" fill-rule="nonzero"/></svg>
</button><button id="vStreamStart" class="btn-start" disabled onclick="start_stream(this);">${n.user.lng == 'ru' ? 'Старт стрим' : 'Start stream'}</button>`:

`<button id="soundBtn" onclick="popa(this);">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 1.269l-18.455 22.731-1.545-1.269 3.841-4.731h-1.827v-10h4.986v6.091l2.014-2.463v-3.628l5.365-2.981 4.076-5.019 1.545 1.269zm-10.986 15.926v.805l8.986 5v-16.873l-8.986 11.068z"/></svg>
</button><button class="btn-start" id="teeTip"  onclick="give_token();">${n.user?n.user.lng=='ru'?'Дать на чай':'Tip':'Дать на чай / Tip'}</button>
<button class="btn-start" id="btnStart" onclick="begin_privat(this);">${n.user?n.user.lng=='ru'?'Приват':'Privat':'Приват / Privat'}</button>`}
${model.brole == "fake" ? "" : `<button id="stopPrivat" class="btn-start" onclick="stop_privat(this);" disabled>${n.user?n.user.lng=='ru'?'стоп приват':'stop privat':'стоп приват / stop privat'}</button>`}

<div id="dopPanel">

${n.owner?`<label class="label-galka" id="sochrVideo"><span>${n.user.lng=='ru'?'Сохранить видео':'Save video'}</span><input id="ifRecord" type="checkbox" ${buser && buser.brole=='superadmin'?'':'disabled'}/><span class="galka"></span></label>
<button id="btnStart" class="btn-start" onclick="snapshot();">${n.user.lng=='ru'?'сделать снимок':'Snapshot'}</button>`:''}
<!-- mute / unmute the sound -->
</div>
</div>

</section>

<section id="chat-container"><div id="chatPanel"><div><b>${n.user?n.user.lng=='ru'?'В&nbsp;чатe&nbsp;':'In&nbsp;chat&nbsp;':'В&nbsp;чатe&nbsp;'}</b><span id="chatcnt">0</span>&nbsp;${n.user?n.user.lng=='ru'?'чел':'people':'чел'}.</div></div>
<div id="chat"></div>
<div id="under-chat">
<textarea id="chatTxt"  class="chat-txt" type="text" placeholder="${n.user?n.user.lng=='ru'?'ваше сообщение':'your message':'ваше сообщение'}" maxlength="200"></textarea>
</div>
<div id="under-chat2">
<button id="btnFoto" onclick="insert_img();" title="${n.user?n.user.lng=='ru'?'вставить фотографию':'insert photo':'вставить фотографию'}">${n.user?n.user.lng=='ru'?'вставить фото':'insert photo':'вставить фото'}</button><button id="vasja" onclick="send_up(this);">${n.user?n.user.lng=='ru'?'отправить':'send':'отправить'}</button>
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
<li> <br><b>Просмотров: </b><span id="clientViews"></span> -->
${n.owner?'':`${model.padrtest || model.padr?`<br><header>${n.user.lng=='ru'?'Биткоин адрес для донатов':'Bitcoin address for donations'} ${model.bname}</header><div id="qrcodeContainer"><div id="qrcode"></div></div>`:''}`}
<!-- {n.owner?'<li><a href="/home/profile/{model.bname}">редактировать</a>':''} -->
</ul>
<hr>
${doska.doska(n)}
${buser && buser.brole=='superadmin'? `<hr>${people({})}`:''}
${n.banner && n.banner.length ? `<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>` : ''}
<output id="webrtc"></output>
<input type="hidden" id="randomStr" value="${n.randomStr}">
<input type="hidden" id="owner" value="${n.owner}">
<input type="hidden" id="buser" value="${buser?true:false}">
<input type="hidden" id="yourNick" value="${buser ? buser.bname:'Anon'}">
<input type="hidden" id="yourLang" value="${buser ? buser.lng : 'ru'}">

<input type="hidden" id="isfake" value="${model&&model.brole=='fake'?true:false}">
<input type="hidden" id="fakesrc" value="${n.videos?n.videos.src:''}">

<input type="hidden" id="modelName" value="${model?model.bname:''}">
<input type="hidden" id="modelId" value="${model?model.id:''}">
<input type="hidden" id="modelProzent" value="${model?model.proz:''}">
<input type="hidden" id="xirTarget" value='${n.xirsys?JSON.stringify(n.xirsys):''}'>
<input type="hidden" id="invoici" value="${model.inv !==null?model.inv:''}">
<input type="hidden" id="devTarget" value="${process.env.DEVELOPMENT=='yes'?'y':'n'}">



<a href="#" class="overlay" id="insImg" onclick="in_rem_hash();"></a>
<div id="setImg" class="popi">
<div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div>
<div id="pizda1">
<label for="forImg">${n.user?n.user.lng=='ru'?'Введите адрес картинки.':'Enter url of a pic.':'Введите адрес картинки.'}'</label><br><br>
<input id="forImg" type="text" placeholder="${n.user?n.user.lng=='ru'?'адрес фото':'pic\'s url':'адрес фото'}"/>
<br><br><br><button onclick="send_ws_img();">${n.user?n.user.lng=='ru'?'Отправить':'Send':'Отправить'}</button>
</div>
</div>

<a href="#" class="overlay" id="privatid" onclick="in_rem_hash();gno();"></a>
<div id="privat2" class="popi">
<div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();gno()"></a></div>
<div id="pizda2">
<div id="privatdialog" data-target=""></div>
<div>
<label class="label-galka">&nbsp;<span>${n.user?n.user.lng=='ru'?'Позволить клиенту бесплатное шоу':'Let it be show for free?':'Позволить клиенту бесплатное шоу'}</span<input id="ifGratis" type="checkbox"/><span class="galka"></span></label>
</div>
<div class="vrite"><button onclick="gno(this)">нет / no </button>&nbsp;&nbsp;<button onclick="gyes(this);">да / yes</button>
</div></div>
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

<meta property="og:site_name" content="globikon"/>
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
