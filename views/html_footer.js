const {login_proto}=require('./login_proto');
const {signup_proto}=require('./signup_proto');
const {reset_proto}=require('./reset_proto');
const {vk, telega} = require('../config/app.json');
const html_footer=n=>{let a=new Date();
return `<section id="footSec"><span class="foot-span">Сайт предназначен для лиц старше 18 лет.
Вход в чат означает Ваше согласие с <a href="/home/privacy">правилами</a>. Если вам менее 18 лет, 
Вы обязаны покинуть этот сайт.</span></section>
<section id="footReklama"><a href="/home/advertise">${n.user && n.user.lng == 'ru'?`Реклама на сайте`:`Реклама на сайте / Advertising`}</a></section><section>
<ul id="basaUl"><li><a href="/basa">FAQ</a></ul></section>
<section id="socseti"><header><b>${n.user && n.user.lng == 'ru'?`Мы в соцсетях`:`Мы в соцсетях / Follow us:`}</b></header>
<a href="${vk}"><img src="/images/vk.png"></a>
<a href="${telega}"><img src="/images/telegram-64x64.png"></a>
</section>
<section><span>&#9400; 2020 - </span><span>${a.getFullYear()}г.</span></section>
<input type="hidden" id="loginStr" value='${login_proto({}) + signup_proto({}) + reset_proto({})}'>
<a href="#" class="overlay" id="vorlogery"></a>
<output id="vorlogin" class="popi">
<div class="wrap-close"><a href="#." class="close" onclick="in_rem_hash();"></a></div>
<div><span id="vhod" onclick="get_login(this);" class="yellow">вход / sign in</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="vout" onclick="get_registr(this);">регистрация / sign up</span></div>
<div id="vorlogincontainer"></div>
</output>

<script src="/js/login.js"></script><!-- html_footer.js -->
`;
}
module.exports={html_footer};
