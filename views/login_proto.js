const login_proto=n=>{
return html`
<section class="login-section">
<form id="formLogin" name="mform" action="/login" method="post" onsubmit="go_login(this);return false;">
<header>Вход</header>
<span id="sessRed"></span><br>
<label for="nameId"><strong>Ник</strong> </label>
<div class="inpwrapDiv">
<input id="nameId" type="text" name="username" placeholder="your name" value="" required />
</div>
<label for="parolId"><strong>Пароль</strong></label>
<div class="inpwrapDiv">
<input id="parolId" type="password" name="password" placeholder="Password" value="" required />
</div>
<a href="">Забыли пароль?</a>
<div class="submitDiv">
<input type="submit" value="Войти">
</div>
<div class="underform">facebook vk</div>
</form></section>`;
}
module.exports={login_proto}
function html(s,...v){
let r='';
for(let i=0;i<v.length;i++){
r+=s[i];
r+=v[i];
}
r+=s[s.length-1];
return r.replace(/\n/g,'');
}
