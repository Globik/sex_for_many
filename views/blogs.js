const file='haupt_page.js',endf=`<!-- ${file} -->`;
const moment=require('moment');
const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const html_admin_nav_menu=require('./html_admin_nav_menu');
const html_footer=require('./html_footer');
const vert_menu=require('./vert_menu.js');
const doska=require('./doska');
const {get_banner, get_banner_podval}=require('./reklama_s');
const blogs=function(n){
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- blogs.js -->
<head>${html_head.html_head({title:"Блог о биткоинах, заработке в интернете, веб камерах", 
meta:get_meta(n.meta),csslink:"/css/main2.css",cssl:["/css/blogs.css"]})}
</head>
<body>${n.warnig?`<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${buser && buser.brole=='superadmin'? html_admin_nav_menu.html_admin_nav_menu(n):''}

${n.banner && n.banner.length ?`<div id="haupt-banner">${get_banner(n.banner)}</div>`:''}

<main id="pagewrap"> 
${vert_menu.vert_menu(n)}
<div id="right">
<!--
page ${n.locals.page}
total aricles: ${n.locals.total_articles};
total_pages ${n.locals.total_pages}
-->
${n.posts?get_posts(n):'Пусто'}
${getPaginator(n)}	
<hr>
${doska.doska(n)}
<hr>
${n.banner && n.banner.length?`<section id="reklamaPodval">${get_banner_podval(n.banner)}</section>`:''}
</div></main>
 <script src="/js/blog.js"></script>
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;}

module.exports={blogs};

function getPaginator(n){
	var pag;
	let s='';
	let page=Number(n.locals.page);
	if(n.locals&&n.locals.rang_page){
	pag=n.locals.rang_page.get(page);
	console.log("pag: ",pag);
}
	

(n.locals.prev ? s+=`<a href="${psaki(n)}"><div class="num">предыдущая</div></a>`:'');

	if(pag){
		
		pag.forEach(function(el,i){
			console.log(i);
			i+=1;
			(page==i ? s+=`<div class="pactive">${i}</div>`:
			 s+=`<a href="${page>=2 && i==1 ? '/blog':`/blog/${i}`}"><div class="num">${i}</div></a>`)
			});
			
		}
		(n.locals.next ? s+=`<a href="/blog/${page+1}"><div class="num">следующая</div></a>`:'');
		return s;
	}


function psaki(n){
	let s='';
	let page=Number(n.locals.page);
	if(page==2){s+="/blog"}else{s+=`/blog/${page-1}`}
	return s;
	}
	
function get_posts(n){
	let s='';
n.posts.forEach(function(el,i){
s+=`<div class="articles-container"><h3>${el.title}</h3><span class="d-author">${el.auth}</span>,
 <span class="d-date">${moment(el.cr_at).format('YYYY-DD-MM')}</span>
	<article>${el.body.substring(0,500)}</article>
	<div><a href="/ru/${el.slug}">Читать</a></div>
	${n.user&&n.user.brole=="superadmin"?`<br><br><br><button data-bid="${el.id}" onclick="rem(this);">delete</button>`:''}</div>`;
	})	
	return s;
	}

function get_meta(n){
let s='';
s+=`
<meta name="description" content="${n.blog.description}">
<meta property="og:title" content="${n.blog.title}">
<meta property="og:description" content="${n.blog.description}">
<meta itemprop="name" content="${n.blog.title}">
<meta itemprop="description" content="${n.blog.description}">
`;
return s;	
}
