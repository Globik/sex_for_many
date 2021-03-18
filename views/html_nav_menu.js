//html_nav_menu.js
const {check_age} = require('../config/app.json');
const html_nav_menu = n=>{
return `<!-- html_nav_menu.js -->
<a href="/" id="aSite"><strong id="strongSite">${n.site}</strong></a>
<label class="label-login">${n.user?`<a href="/logout">${n.user.lng=='ru'?'выход':'sign out'}</a>`:`<a href="/login">вход | log in</a>`}</label>
<ul id="menu">
<li><a href="/"><div class="mnav">${n.user?n.user.lng=='ru'?'Стримы':'Streams':'Стримы'}</div></a>
<li><a href="/blog"><div class="mnav">${n.user?n.user.lng=='ru'?'Блог':'Blog':'Блог'}</div></a>

</ul>
<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>

<ul id="miniMenu" class="">
<li><a href="/"><div class="muka"><span>${n.user?n.user.lng=='ru'?'Стримы':'Live streams':'Стримы'}</span></div></a>
${n.user?`<li><a href="/webrtc/${n.user.id}"><div class="muka"><span>${n.user.lng=='ru'?'Мой видеочат':'My videochat room'}</span></div></a>`:''}
${n.user?`<li><a href="/home/profile/{n.user.bname}"><div class="muka"><span>${n.user.lng=='ru'?'Личный кабинет':'Dashboard'}</span></div></a>`:''}
<li><a href="/obi"><div class="muka"><span>${n.user?n.user.lng=='ru'?'Доска объявлений':'Meassage board':'Доска объявлений'}</span></div></a>
<!-- <li><a href="/home/users"><div class="muka"><span>Пользователи</span></div></a> -->
<li><a href="/blog"><div class="muka"><span>${n.user?n.user.lng=='ru'?'Блог':'Blog':'Блог'}</span></div></a>
<!-- <li><a href="/videos"><div class="muka"><span>Видео</span></div></a> -->
${n.user?`<li><a href="/tokens"><div class="muka"><span>${n.user.lng=='ru'?'Купить токены':'Purchase tokens'}</span><span id="tokencntnav">${n.user.items}</span></div></a>`:''}
${n.user?`<li><a href="/logout" id="login_pop"><div class="muka"><span>${n.user.lng=='ru'?'Выйти':'Sign out'}</span></div></a>`:
`<li><a href="/login"><div class="muka"><span>Войти / Sign in</span></div></a>`}
${!n.user ? '<li><a href="/signup"><div class="muka"><span>Регистрация / Sign up</span></div></a>':''}
</ul>

<a href="#." class="overlay" id="message_box"></a>
<output id="out_box" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="inbox"></div>
</output>
${check_age?`
<a href="#.+" class="overlay" id="message_box2"></a>
<output id="out_box2" class="popi">
<!-- <div class="wrap-close"><a href="#." class="close"></a></div> -->
<div id="inbox2">Вам исполнилось 18 лет? | Are you 18?</div>
<button class="yesno" onclick="say_no();">нет | no</button><button class="yesno" onclick="say_yes();">да | yes</button>
</output>
<dialog  id="dialogConfirm2">
<div id="inbox32">Вам исполнилось 18 лет? Are you 18?</div>
<form id="dialogForm2" method="dialog" style="display:nne;">
<button type="submit" value="false">нет  no</button><button type="submit" value="true">да | yes</button>
</form>
</dialog>
`:''}
<dialog  id="dialogConfirm">
<div id="inbox3"></div>
<form id="dialogForm" method="dialog" style="display:nne;">
<button id="dialogCancelbtn" type="reset" onclick="dialogConfirm.close();">cancel</button>
<button type="submit" value="true">yes</button><button type="submit" value="false">no</button>
</form>
</dialog>

<output class="alert" id="alert_id">
<div id="inbox2"></div>
</output>
<script src="/js/nav.js"></script><!-- end of html_nav_menu.js -->`;}
module.exports={html_nav_menu};
