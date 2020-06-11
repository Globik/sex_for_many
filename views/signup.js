//signup.js
const signup_proto=require('./signup_proto.js');
var dev_user=process.env.DEV_USER,
dev_pwd=process.env.DEV_PWD,
dev_email=process.env.DEV_EMAIL;
const login_css=require('./login_css.js'),
html_head=require('./html_head.js');
const {js_help}=require('../libs/helper.js');

var fu=true;var fu2=true;
const signup = n =>{
	
let messi=m=>{
console.log('msg: ',m)
let s='';
if(m){
if(!m.success){
if(m.code){
if(m.code=='23505'){
if(m.bcode==2){s=m.message;fu2=false;}else if(m.bcode==1){
s=m.message;
fu=false;
}else{s+=m.message}

}else{
s=m.message;
}
}else{s=m.message;}
}else{s+=`${m.msg ? m.msg : ''}`}
	}
return s;
}
let f='border:2px solid red;color:red;'
function do_inp(){
let s='';
if(!fu)s+=f;fu=true;
return s;
}
function do_inp2(){
let s='';
if(!fu2)s+=f;fu2=true;
return s;
}
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
return `<!DOCTYPE html><html lang="en">
<head>
${html_head.html_head({title:"sign up",cssl:["/css/main2.css"]})}
</head>
<body>

<main id="pagewrap">
<a href="/">Стримы</a>&nbsp;&nbsp;&nbsp;<a href="/login">Войти</a>
${signup_proto.signup_proto({})}
${js_help(['/js/login.js'])}
</main></body></html>`;
}
module.exports={signup};
