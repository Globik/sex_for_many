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
<h1>fake videos</h1>
<div><input id="tfile" type="file"></div>
<script src="/js/index.js"></script>
<script src="/js/fakevideo.js"></script>
</main>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}
module.exports={fakevideo}
