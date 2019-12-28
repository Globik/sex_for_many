const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer');
const {js_help}=require('../libs/helper.js');
const reklama = n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- reklama.js -->
<head>${html_head.html_head({title:'Реклама',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/reklama.css"],luser:buser})}
</head>
<body>
<nav class="back">${html_nav_menu.html_nav_menu({buser})}</nav>
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"><h2>Реклама</h2>
<h6>Рекламные фотографии</h6>
<button onclick="fetch_folder(this);">Открыть папку</button>
<section id="fcontent"></section>
<footer id="ffooter"><form name="fileupload"><input name="filein" type="file"><input type="submit" value="Загрузить"></form></footer>
<hr>
</main>
<footer id="footer">${html_footer.html_footer({})}</footer>
${js_help(["/js/reklama.js"])}
</body>
</html>`;
}
module.exports={reklama};
