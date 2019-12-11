const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');


const motion=n=>{
const {lusers}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en">
<head>${html_head.html_head({title:"MotionPix",csslink:"/css/main2.css",cssl:["/css/style.css"], luser:buser})}
<link href="/css/style.css" rel="stylesheet">

</head>
<body>
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>

${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"><h1>Motion pix</h1> 
<button onclick="fetch_was();">fetch was</button>
<button oclick="put_was();">put was</button>
<br><br>
<div id="player"></div>
</main>
<script src="/js/register-events.js"></script>
<script src="/js/signaling.js"></script>
<script src="/js/video-player.js"></script>
<script src="/js/motion.js"></script>



<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`	
};
module.exports={motion}
