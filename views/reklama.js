const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
   const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
const moment=require('moment');
const reklama = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- reklama.js -->
<head>${html_head.html_head({title:'Реклама',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/reklama.css"]})}
</head>
<body>
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right"><h2>Реклама</h2>
<h6>Рекламные фотографии</h6>
<button onclick="fetch_folder(this);">Открыть папку</button>
<section id="fcontent"></section>
<!-- <footer id="ffooter"><form name="fileupload"><input name="filein" type="file"><input type="submit" value="Загрузить"></form></footer> -->
<hr>
<form name="zform" method="POST" action="/api/set_reklama">
<header>Зарядить рекламу</header><br>
<label for="zFile">src</label><input name="zfile" id="zFile" type="file" required><br>

<label for="zHref">href</label><input name="zhref" id="zHref" type="text" required placeholder="http://example.com"><br>
<label for="zStart">start</label><input name="zstart" id="zStart" type="date" required><br>
<label for="zEnd">end</label><input name="zend" id="zEnd" type="date" required><br>
<label for="zName">name</label><input name="zname" id="zName" type="text" required placeholder="Имя фирмы"><br>
<label for="zStatus">status</label>
<select required name="zstatus" id="zStatus">
<option value="1">on start</option>
<option value="2">active</option>
<option value="3">dead</option>
</select><br>
<label>info</label><textarea name="zmeta" placeholder="email, contacts"></textarea><br>
<label for="zType">type</label>
<select name="ztype" id="zType" required><option value="1">main banner</option><option value="2">aside banner</option></select><br>
<label for="zPrice">price</label><input name="zprice" id="zPrice" type="number" required placeholder="price"><br>
<!-- <label>created at: <span></span></label><br>
<label>clicks: <span></span></label> -->
<br>
<input type="reset" value="Сбросить">
<input type="submit" value="Cохранить">
</form>
<hr>
<h2>Статусы рекламных объявлений.</h2>

${n.result&& n.result.length?get_stat(n.result):'Нет пока'}

</div></main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer>
${js_help(["/js/reklama.js"])}
</body>
</html>`;
}
module.exports={reklama};
function get_stat(n){
	let s='';
	n.forEach(function(el,i){
		s+=`
		<ul data-ul="${el.id}" class="${el.statu==1?'orange':'green'}"><li>src: ${el.src}
		<img style="height:40px;" src="/reklama/${el.src}"/>
		<li>href: ${el.href}
		<li>start time: ${moment(el.anf).format("DD-MM-YYYY")}&nbsp;<input data-ulstart="${el.id}" type="date">&nbsp;<button data-id="${el.id}" onclick="save_start(this);">save</button>
		<li>end time: ${moment(el.ed).format("DD-MM-YYYY")}&nbsp;<input type="date" data-ulend="${el.id}">&nbsp;<button data-id="${el.id}" onclick="save_end(this);">save</button>
		<li>name: ${el.nick}
		<li>status: <select data-ulselect="${el.id}"><option value="1" ${el.statu==1?'selected':''}>on start</option>
<option value="2" ${el.statu==2?'selected':''}>active</option>
<option value="3">dead</option></select>&nbsp;<button data-id="${el.id}" onclick="save_opt(this);">save</button>
<li>info: <div data-ulcontent="${el.id}" contenteditable>${el.meta}</div><button data-id="${el.id}" onclick="save_edit(this);">save</button>
<li>type: ${el.typ==1?'main banner':'aside banner'}
<li>price: ${el.price}
<li>created at: ${moment(el.cr_at).format("DD-MM-YYYY")}
<li>clicks: ${el.cl}<br><button data-id="${el.id}" onclick="del_reklama(this);">delete</button>
		</ul>`;
		})
	return s;
	}
