const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const doska=require('./doska');
const {get_banner, get_banner_podval}=require('./reklama_s');
var warnig=false;

const blogs=function(n){
const {lusers}=n;
const buser=n.user;

return `<!DOCTYPE html><html lang="en">
<head>${html_head.html_head({title:"blogs",/* meta:get_meta(),*/csslink:"/css/main2.css",cssl:["/css/blogs.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap"> blogs
<hr>
${doska.doska({})}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</main>
<!-- <script src="/js/gesamt.js"></script> -->
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports={blogs};
