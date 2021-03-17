//signup.js
const signup_proto = require('./signup_proto.js');
const html_head = require('./html_head.js');
const {js_help} = require('../libs/helper.js');
const signup = n =>{
return `<!DOCTYPE html><html lang="en"><!-- signup.js -->
<head>
${html_head.html_head({title: "регистрация / sign up", cssl: ["/css/main2.css"]})}
</head>
<body>
<main id="pagewrap">
<a href="/">Стримы / Home</a>&nbsp;&nbsp;&nbsp;<a href="/login">Войти / Sign in</a>
<header style="text-align:center;">Регистpaция / Sign up</header>
${signup_proto.signup_proto({})}
${js_help(['/js/login.js'])}
</main></body></html>`;
}
module.exports = {signup};
