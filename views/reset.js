const html_head=require('./html_head');
const dev_pwd=process.env.DEV_PWD;

const {reset_proto}=require('./reset_proto.js')
const {js_help}=require('../libs/helper.js');

const reset= n =>{
function messi(n){
let s='';
if(n){
if(n.success){s=n.message}else{s=`<b>Your Password Change Complete!</b><br><br>${n.message}`}
}
return s;
}
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
return `<!DOCTYPE html><html lang="en">
<head>
${html_head.html_head({title:"Reset Password", cssl:["/css/main2.css"]})}
</head><body>
<main id="pagewrap">
${reset_proto({})}
${js_help(['/js/login.js'])}
</main></body></html>`;};
module.exports={reset};
