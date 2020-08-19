const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
const moment=require("moment");
const {get_banner, get_banner_podval}=require('./reklama_s');
const obi = function(n){
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- obi.js -->
<head>${html_head.html_head({title:'Доска объявлений о сексе, знакомствах, тусовках, встречах',meta:get_meta(n.meta),
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/obi.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>

${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}


<main id="pagewrap">
${vert_menu.vert_menu(n)}
<div id="right">
<h1>Доска объявлений. <a href="#obiContainer">Подать объявление.</a></h1>
${n.banner?'<h4 class="doskah">$$$&nbsp;<a href="/home/advertise">Напиши нам для платного закрепления в топе</a>&nbsp;$$$</h4>':''}
<section id="fuckSection">${n.obis&&n.obis.length>0?get_obi(n):'Пока объявлений нет.'}</section><hr>
<section id="obiContainer">
<div id="obiDiv"><header>Подать объявление</header>
<form name="obi" method="post" action="/api/save_obi">
<label>Имя *<br><input type="text" maxlength="100" name="nick" value="${buser?buser.bname:''}" placeholder="Обязательно" required></label><br>
<label>Текст объявления *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="fspan">0</span> (1500)<br>
<textarea maxlength="1500" name="msg" oninput="finput(this);" placeholder="Объявления без контакта для связи удаляются" required></textarea></label>
<input type="hidden" name="nid" value="${buser?buser.id:''}">
<input type="hidden" name="admin" value="${buser && buser.brole=='superadmin'?true:false}">
<br><input type="submit" value="Опубликовать">${buser && buser.brole=='superadmin'?'&nbsp;&nbsp;<input type="checkbox" id="zakrep" name="zakrep"><label for="zakrep">закрепить</label>':''}<br><br>
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
<li>Вы пытались что-то <strong>рекламировать или продавать</strong>. <a href="/home/advertise">Купите рекламу</a></li></ul>
<a href="#tab2" onclick="ba();">обратно к правилам</a><div class="kreuz" onclick="remdas();">X</div>
</div></div>
</section>
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
</body>
${js_help(["/js/obi.js"])}
</html>`;
}
module.exports={obi}

function get_obi(n){
let abba=[];
let s='';
if(Array.isArray(n.obis)){
n.obis.forEach(function(el,i){
if(el.isg==6)abba.unshift({id:el.id, msg:el.msg})
if(el.isg !=6)abba.push(el);	
})	
if(abba.length>0){
abba.forEach(function(el,i){
s+=`<div data-id="${el.id}" class="chelobi"><header><b>${el.bnick?el.bnick:''}</b></header><p class="chelp">${el.msg}</p>
${el.ati?`<div class="chdata">${moment(el.ati).format('YYYY-MM-DD hh:mm')}</div>`:''}${n.user && n.user.brole=='superadmin'?
`<button data-vid="${el.id}" onclick="del_obi(this);">удалить</button>`:''}</div>`;		
})
}
}
return s;
}

function get_meta(n){
let s='';
s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:url" content="${n.url}"/>
<meta property="og:image" content="${n.image}" />
<meta property="og:title" content="${n.obi.title}"/>
<meta property="og:description" content="${n.obi.description}"/>

<meta property="og:site_name" content="gayroom"/>
<meta itemprop="name" content="${n.obi.title}"/>
<meta itemprop="description" content="${n.obi.description}"/>`
return s;
}
