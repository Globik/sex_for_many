const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
//const moment=require('moment');

const videofiles=function(n){
const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- videofiles.js -->
<head>${html_head.html_head({title:"Видеофайлы",csslink:"/css/main2.css",cssl:["/css/videofiles.css"], luser:buser})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}
<main id="pagewrap">
<h1>Видеофайлы</h1>
<section id="sectionVideofiles">${n.result && n.result.length>0?get_videofiles(n.result):'Упс, пока нет видеофайлов.'}</section>
</main>
<script src="/js/videofiles.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}
module.exports={videofiles};
function get_videofiles(arr){
let s=`<div><span>Всего </span><span>${arr.length-2}</span><span> видео.</span></div><ul>`;
arr.forEach(function(el, i){
s+=`<li class="videoli" data-srcF="${el}">${el}&nbsp;<button data-src="${el}" onclick="del_video_f(this);">Удалить</button></li>`;	
})	
s+='</ul>'
return s;
}
