const file='haupt_page.js',endf=`<!-- ${file} -->`;
const moment=require('moment');
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
<head>${html_head.html_head({title:"Блог", meta:get_meta(),csslink:"/css/main2.css",cssl:["/css/blogs.css"], luser:buser})}
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap"> 
<!--
page ${n.locals.page}
total aricles: ${n.locals.total_articles};
total_pages ${n.locals.total_pages}
-->
${n.posts?get_posts(n):'Пусто'}
${getPaginator(n)}	
<hr>
${doska.doska({})}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</main>
 <script src="/js/blog.js"></script>
<footer id="footer">${html_footer.html_footer(n)}</footer></body></html>`;}

module.exports={blogs};

function getPaginator(n){
	
	let s='';
	let page=Number(n.locals.page);
	var pag=n.locals.rang_page.get(page);
	console.log("pag: ",pag);
(n.locals.prev ? s+=`<a href="${psaki(n)}"><div class="num">предыдущая</div></a>`:'');

	if(pag){
		
		pag.forEach(function(el,i){
			console.log(i);
			i+=1;
			(page==i ? s+=`<div class="pactive">${i}</div>`:
			 s+=`<a href="${page>=2 && i==1 ? '/home/blog':`/home/blog/${i}`}"><div class="num">${i}</div></a>`)
			});
			
		}
		(n.locals.next ? s+=`<a href="/home/blog/${page+1}"><div class="num">следующая</div></a>`:'');
		return s;
	}


function psaki(n){
	let s='';
	let page=Number(n.locals.page);
	if(page==2){s+="/home/blog"}else{s+=`/home/blog/${page-1}`}
	return s;
	}
	
function get_posts(n){
	let s='';
n.posts.forEach(function(el,i){
s+=`<div class="articles-container"><h3>${el.title}</h3><span class="d-author">${el.auth}</span>,
 <span class="d-date">${moment(el.cr_at).format('YYYY-DD-MM')}</span>
	<article>${el.body.substring(0,100)}</article>
	<div><a href="/home/ru/${el.slug}">Читать</a></div>
	${n.user&&n.user.brole=="superadmin"?`<button data-bid="${el.id}" onclick="rem(this);">delete</button>`:''}</div>`;
	})	
	return s;
	}

function get_meta(){
let s='';
s+=`
<meta name="description" content="Блог o">
<meta property="og:title" content="Блог">
<meta property="og:description" content="Блог о">
<meta itemprop="name" content="Блог">
<meta itemprop="description" content="Блог o">
`;
return s;	
}



