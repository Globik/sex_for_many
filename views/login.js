//login.js
const html_head=require('./html_head.js'),
	  login_css=require('./login_css.js'),
	  login_proto=require('./login_proto.js');
const {js_help}=require('../libs/helper.js');
const login= n =>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Log in",cssl:["css/main2.css"]})}</head>
<body>
<main id="pagewrapi">
<a href="/">Стримы Home</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/signup">Регистрация Sign up</a>
${login_proto.login_proto(n)}
</main></body>
${js_help(['/js/login.js'])}
</html>`;}
module.exports={login};
