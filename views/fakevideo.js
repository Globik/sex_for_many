const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');

const fakevideo=function(n){
const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- fakevideo.js -->
<head>${html_head.html_head({title:"Сервис видеостримов для взрослых.",csslink:"/css/main2.css",cssl:["/css/fakevideo.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">
<div><span id="ferr"></span></div>
<div><span id="fprogress"></span></div>
<div><span id="fertig"></span></div>
<h2>1. create user</h2>
<div><input id="usernameinput" type="text" placeholder="name"></div>
<div>
<span id="username"></span> | <span id="us_id"></span> <button onclick="send_name(this);">create user</button>
</div>

<h2>2. fake videos</h2>
<div><input id="tfile" type="file"></div>
<div>
<h2>3. Poster</h2>
<div><form method="post" name="posterform" action="/fake_poster">
<div><input type="file" id="tposter" name="tposter"></div>
<div><input type="submit" value="save"></div>
</form></div>
</div>
<div>
<h2>add description</h2>
<div><label for="roomdescr">add room description:</label><br>
<input type="text" id="roomdescr">&nbsp;&nbsp;<button onclick="save_room_descr(this);">save</button>
</div>
</div>
<script src="/js/index.js"></script>
<script src="/js/fakevideo.js"></script>
</main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}
module.exports={fakevideo}
