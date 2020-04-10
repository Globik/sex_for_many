//footer.js
const html_footer=n=>{let a=new Date();
return `<section id="footSec"><span class="foot-span">Сайт предназначен для лиц старше 18 лет.
Вход в чат означает Ваше согласие с <a href="/home/privacy">правилами</a>. Если вам менее 18 лет, 
Вы обязаны покинуть этот сайт.</span></section>
<section id="footReklama">
<a href="/home/advertise">Реклама на сайте</a></section>
<section><ul id="basaUl">
<li><a href="/basa">База знаний.</a>
</ul></section>
<section id="socseti"><header><b>Мы в соцсетях</b></header>
<a href="https://vk.com/club189056307"><img src="/images/vk.png"></a>
<a href="https://t.me/gaychel"><img src="/images/telegram-64x64.png"></a>
</section>
<section><span>&#9400; 2020 - </span><span>${a.getFullYear()}г.</span></section>
`;
}
module.exports={html_footer}; 
