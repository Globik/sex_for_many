const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;

const obi = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- chat_room.js -->
<head>${html_head.html_head({title:'Oбъявления',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/obi.css"],luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"><h2>Доска объявлений</h2>
<section id="obiContainer">
<div id="obiDiv"><header>Подать объявление</header>
<form name="obi" method="post" action="/api/save_obi">
<label>Имя *<br><input type="text" maxlength="100" name="nick" placeholder="Обязательно" required></label><br>
<label>Текст объявления*&nbsp;<span id="fspan">0</span>&nbsp;(1500)<br>
<textarea maxlength="1500" name="msg" oninput="finput(this);" placeholder="Объявления без контакта для связи удаляются" required></textarea></label>
<br><input type="submit" value="Опубликовать"><br><br>
<a href="#regata" id="regata" onclick="do_reg(this);">Правила публикации</a>
</form>

</div>
<div id="regelDiv"><div id="suka1" class="nu active"><h3>Общие правила публикации:</h3>
<ul>
<li>Всегда оставляйте <strong>контакт для связи</strong>. Не переписывайтесь на доске</li>
<li>Вам нет 18 лет? <strong>Объявление будет удалено</strong></li>
<li>Помните, публикация подставных данных это <strong>преступление</strong></li>
</ul>
<a href="#tab1" onclick="ba();">Почему мои объявления удаляют?</a>
<div class="kreuz" onclick="remdas();">X</div></div>
<div class="nu" id="suka2"><h3>Почему мои объявления удаляют?</h3>
<ul>
<li>Вы <strong>"зассоряете эфир"</strong> перепиской непосредственно на доске</li>
<li>Вы <strong>не указали контакт</strong> для связи</li>
<li>Вы <strong>перепутали раздел</strong></li>
<li>Вы подаете объявления <strong>слишком часто</strong></li>
<li>Вы пытались что-то <strong>рекламировать или продавать</strong>. <a href="">Купите рекламу</a></li></ul>
<a href="#tab2" onclick="ba();">обратно к правилам</a><div class="kreuz" onclick="remdas();">X</div>
</div></div>
</section>
<hr>
${n.obis&&n.obis.length>0?get_obi(n.obis):'Пока объявлений нет.'}
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
</body>
${js_help(["/js/obi.js"])}
</html>`;
}
module.exports={obi}
function get_obi(n){
let s=''
if(Array.isArray(n)){
n.forEach(function(el,i){
s+=`<div data-id="${el.id}" class="chelobi"><header><b>${el.bnick}</b></header><p class="chelp">${el.msg}</p></div>`;	
})	
}
return s;
}
