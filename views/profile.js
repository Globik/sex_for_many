const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  

let profile=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Мой профайл", csslink:"/css/main2.css",
cssl:["/css/user_profile.css"]})}</head>
<body><!-- profile -->
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Заполнить профиль</h3>
${n.err?n.err:''}
	<p>Здесь Вы можете оставить о себе любую информацию, которой хотели бы поделиться с другими.
	И тогда Ваш профиль будет показан в Вашем личном (видео)чате. По окончании <b>кликните на "Сохранить профиль"!</b></p>
	<form name="fprofi" action="/api/save_profile" method="post">
	<h3>Профиль</h3>
	<p>Вам хочется, чтобы Вас нашли? Если Вы напишите здесь что-нибудь интересненькое, 
	то вероятен шанс на получение скорейшего отклика.</p>
	<p><strong style="color:red;">*Внимание!<br>
	Публикация любых объявлений с упоминанием возраста моложе 18-ти лет строго запрещена!</strong>
	<a href="/home/rules">Правила размещения объявлений.</a></p>
	<div>
	<label for="fageId"><strong>Сколько вам лет?</strong> (не моложе 18-ти!)</label><br>
	<input id="fageId" name="age" type="number" min="18" max="100" value="${n.result?n.result.age:'18'}">
	</div>
	<div>
	
	<label><strong>Ваш месседж</strong></label><span id="fspan">${n.result&&n.result.msg?(400-n.result.msg.length):400}</span>&nbsp;/&nbsp;400<br>
	<div style="border:1px solid silver;" id="fcont" data-max="400" contenteditable='' 
	oninput="finput(this);">${n.result&&n.result.msg?n.result.msg:''}</div>
	<!-- <textarea id="profTxtar" name="txt_msg" placeholder="Ваше сообщение" maxlength="400" oninput="finput(this);"></textarea> --><br>
	</div>
	<div><label for="avaId"><strong>Ваше фото</strong> (тело не моложе 18-ти, не голое)</label><br>
	<input id="aveId" type="file" accept="image/*" onchange="thumb(this.files);">
	<input id="fotoTxt" type="hidden" name="photo" value="${n.result&&n.result.ava?n.result.ava:''}">
	<input type="hidden" name="fname" value="${buser?buser.bname:''}">
	</div>
	<div>
<div style="border:1px solid green;display:inline-block;" id="preview"></div>

${n.result && n.result.ava?`<figure id="figFoto" style="border:1px solid black;display:inline-block;">
<img src="${n.result.ava}" width="100">${n.owner?`<figcaption><b style="color:darkblue;" data-fname="${buser?buser.bname:''}"
	 onclick="del_foto(this);">Удалить</b></figcaption>`:''}
	</figure>`:''}
<br>${n.owner?'<input id="profSubm" type="submit" value="Сохранить профиль">':''}</div>
</form>
</main>
${js_help(["/js/user_profile.js"])}
<footer id="footer">${html_footer.html_footer(n)}</footer></body></html>`;
}
module.exports={profile};
