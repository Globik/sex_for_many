// head.js
const {js_help}=require('../libs/helper.js');
const html_head=n=>{
return `<meta charset="utf-8">
<title>${n.title ? n.title : "Simple title"}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
${n.meta ? n.meta : ''}
<!-- <meta name="yandex-verification" content="c278551dc430f58d" /> -->
<link rel="shortcut icon" type="image/ico" href="${process.env.DEVELOPMENT=='yes'?'/images/w4.png':'https://globikon.space/images/w4.png'}"> 
${n.csslink ? `<link href="${n.csslink}" rel="stylesheet">` :''}
${n.csslink2 ? `<link href="${n.csslink2}" rel="stylesheet">` : ''}
${n.cssl ? get_cssl(n) : ''}
<!-- {n.user&&n.user.brole=='superadmin'?'<link href="/css/abuse_notes.css" rel="stylesheet">':''} -->
${n.csshelper ? `<style>${n.csshelper}</style>`:''}
<script>
var flexsupport=false;
var html=document.getElementsByTagName("html")[0],dtct=document.createElement('div');
dtct.style.display='flex';if(dtct.style.display === 'flex'){
html.className='flex';flexsupport=true;
}else{}
</script>  
<script src="/js/globalik.js"></script>
<!-- <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script> -->
<!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<!--[if lt IE 9]><script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
${n.js ? js_help(n):''}`;
}
module.exports={html_head};

function get_cssl(n){
let s='';
n.cssl.forEach((el,i)=>{
s+=`<link href="${el}" rel="stylesheet">`;
})
return s;
}
