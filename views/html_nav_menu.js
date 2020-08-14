//html_nav_menu.js
const html_nav_menu=n=>{
return `<!-- html_nav_menu.js -->
<a href="/" id="aSite"><strong id="strongSite">GAYROOM.RU</strong></a>
<label class="label-login">${n.buser?'<a href="/logout">выход</a>':'<a href="/login">вход</a>'}</label>
<ul id="menu">
<li><a href="/"><div class="mnav">Стримы</div></a>
<li><a href="/home/blog"><div class="mnav">Блог</div></a>
<li><a href="/home/obi"><div class="mnav">Доска объявлений</div></a>
</ul>
<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>

<ul id="miniMenu" class="">
<li><a href="/"><div class="muka"><span>Стримы</span></div></a>
${n.buser?`<li><a href="/webrtc/${n.buser.id}"><div class="muka"><span>Мой видеочат</span></div></a>`:''}
<!-- {n.buser?'<li><a href="/home/profile/{n.buser.bname}"><div class="muka"><span>Мой профиль</span></div></a>':''} -->
<li><a href="/home/obi"><div class="muka"><span>Доска объявлений</span></div></a>
<!-- <li><a href="/home/users"><div class="muka"><span>Пользователи</span></div></a> -->
<li><a href="/home/blog"><div class="muka"><span>Блог</span></div></a>
<!-- <li><a href="/videos"><div class="muka"><span>Видео</span></div></a> -->
<li><a href="/tokens"><div class="muka"><span>Купить токены</span></div></a>
${n.buser?'<li><a href="/logout" id="login_pop"><div class="muka"><span>Выйти</span></div></a>':
'<li><a href="/login"><div class="muka"><span>Войти</span></div></a>'}
<!-- <li><a href="/signup"><div class="muka"><span>sign up</span></div></a> -->
</ul>

<a href="#." class="overlay" id="message_box"></a>
<output id="out_box" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="inbox"></div>
</output>
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
