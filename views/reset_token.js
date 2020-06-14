const html_head=require('./html_head');
const html_nav_menu=require('./html_nav_menu');
const reset_token=function(n){
const {lusers}=n;
const buser=n.user;

return `<!DOCTYPE html><html lang="en"><!-- reset_token.js -->
<head>${html_head.html_head({title:"Смена пароля",csslink:"/css/main2.css", cssl:["/css/reset_token.css"], luser:buser})}
</head>
<body>
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser})}</nav>
<main id="pagewrap">
${n.err?`<h1>${n.err}</h1>`:`
<h1>Смена пароля</h1>
<div id="reset-wrap">
<form id="resetform" method="post" action="/reset/reset_token">
<div class=""><p>
Ввведите новый пароль.
</p></div>
<span id="sessRed" class=""></span>
<div>
<label><strong>Email:</strong><br>
<input type="email" class="reset-email" name="email" value="" placeholder="Your email" required autocomplete="off">
<label>
</div><div>
<label><strong>Пароль:</strong><br><!-- pattern=".{6,}" -->
<input type="password" id="pwd" class="login-pwd" name="password" autocomplete="new-password" 
placeholder="пароль" value="" required autofocus maxlength="20">
</label>
<input type="hidden" name="token" value="${n['reset-token']}">
<u class="blue"><small id="smally" class="blue" onclick="show_pwd();">показать пароль</small></u>
</div><div>
<input type="submit" class="login-submit" value="Сохранить">
</div>
</form>
</div>
<script src="/js/reset_token.js"></script>`}
</main></body></html>`
}
module.exports={reset_token}
