const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const vert_menu=require('./vert_menu.js');
const html_footer=require('./html_footer');
const writePost=function(n){
const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- writePost.js -->
<head>${html_head.html_head({title:"Написать в блог", csslink:"/css/main2.css",cssl:["/css/writePost.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">${vert_menu.vert_menu(n)}<div id="right">
<h2>Написать в блог</h2>
<button onclick="fetch_folder(this);">blog fotos</button>
<div id="fcontent"></div>
<br>
<form name="postform" method="post" action="/api/writePost">
<label>Post title:<br><input type="text" name="title" equired placeholder="title"><label><br>
<label>Author:<br><input type="text" name="auth" placeholder="author" value="${buser.bname}" equired></label><br>
<label>Text:<br><textarea name="body" placeholder="text" equired></textarea></label><br>
<label>Metatag description:<br><textarea name="descr" placeholder="social description"></textarea></label><br>
<input type="reset" value="Сбросить">
<input type="submit" value="Сохранить">
</form>
<hr>
<form name='formw' method='post' action='/api/save_foto_blog'><input name='filew' type='file'>
<input type='submit' value='Загрузить картинку'>
</form>

<div id="inlineFoto"></div><br>
</div></main>
<script src="/js/writePost.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}

module.exports={writePost};
