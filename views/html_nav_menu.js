//html_nav_menu.js
const {check_age}=require('../config/app.json');
const html_nav_menu=n=>{
return `<!-- html_nav_menu.js -->
<a href="/" id="aSite"><strong id="strongSite">${n.site}</strong></a>
<label class="label-login">${n.user?'<a href="/logout">выход</a>':'<a href="/login">вход</a>'}</label>
<ul id="menu">
<li><a href="/"><div class="mnav">Стримы</div></a>
<li><a href="/blog"><div class="mnav">Блог</div></a>
<li><a href="/obi"><div class="mnav">Доска объявлений</div></a>
</ul>
<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>

<ul id="miniMenu" class="">
<li><a href="/"><div class="muka"><span>Стримы</span></div></a>
${n.user?`<li><a href="/webrtc/${n.user.id}"><div class="muka"><span>Мой видеочат</span></div></a>`:''}
<!-- {n.user?'<li><a href="/home/profile/{n.user.bname}"><div class="muka"><span>Мой профиль</span></div></a>':''} -->
<li><a href="/obi"><div class="muka"><span>Доска объявлений</span></div></a>
<!-- <li><a href="/home/users"><div class="muka"><span>Пользователи</span></div></a> -->
<li><a href="/blog"><div class="muka"><span>Блог</span></div></a>
<!-- <li><a href="/videos"><div class="muka"><span>Видео</span></div></a> -->
${n.user?`<li><a href="/tokens"><div class="muka"><span>Купить токены</span><span id="tokencntnav">${n.user.items}</span></div></a>`:''}
${n.user?'<li><a href="/logout" id="login_pop"><div class="muka"><span>Выйти</span></div></a>':
'<li><a href="/login"><div class="muka"><span>Войти</span></div></a>'}
<!-- <li><a href="/signup"><div class="muka"><span>sign up</span></div></a> -->
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
<div id="inbox2">Вам исполнилось 18 лет?</div>
<button class="yesno" onclick="say_no();">нет</button><button class="yesno" onclick="say_yes();">да</button>
</output>
<dialog  id="dialogConfirm2">
<div id="inbox32">Вам исполнилось 18 лет?</div>
<form id="dialogForm2" method="dialog" style="display:nne;">
<button type="submit" value="false">нет</button><button type="submit" value="true">да</button>
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
