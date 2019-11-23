const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js

const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;

let profile=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Мой профайл", csslink:"/css/main2.css"})}
<style>
input[type=text]{border-color:red;}
input[type=text] > span.val:after{content:"suka",padding-left:10px;}
</style>
</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
<h3>Заполнить профиль</h3>
	<p>Здесь Вы можете оставить о себе любую информацию, которой хотели бы поделиться с другими.
	И тогда Ваш профиль будет показан в Вашем личном (видео)чате. По окончании <b>кликните на "Сохранить профиль"!</b></p>
	<form name="fprofi">
	<h3>Профиль</h3>
	<p>Вам хочется, чтобы Вас нашли? Если Вы напишите здесь что-нибудь интересненькое, 
	то вероятен шанс на получение скорейшего отклика.</p>
	<p><strong style="color:red;">*Внимание!<br>
	Публикация любых объявлений с упоминанием возраста моложе 18-ти лет строго запрещена!</strong>
	<a href="/home/rules">Правила размещения объявлений.</a></p>
	<div>
	<label for="fageId">Сколько вам лет? (не моложе 18-ти!)</label><br>
	<input id="fageId" name="age" type="number" min="18" max="100" value="18">
	</div>
	<div>
	<label>Ваш месседж</label><br><textarea name="txt_msg" placeholder="Ваше сообщение"></textarea><br>
	</div>
	<div><label for="avaId">Ваше фото (тело не моложе 18-ти, не голое)</label><br>
	<input id="aveId" type="file" accept="image/*" onchange="thumb(this.files);">
	<input id="fotoTxt" type="hidden" name="photo">
	</div>
	<div>
<div style="border:1px solid green;display:inline-block;" id="preview"></div>
<figure id="figFoto" style="border:1px solid black;display:inline-block;">
<img src="donatebutton.jpg" width="100"><figcaption><b style="color:darkblue;" onclick="del_foto();">Удалить</b></figcaption></figure>
<br><input type="submit" value="Сохранить профиль"></div>
</form>
</main>
${js_help(["/js/user_profile.js"])}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports={profile};
