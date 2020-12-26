const login_proto=n=>{
return html`
<section id="loginSection" class="tabactive">
<form id="formLogin" name="mform" action="/login" method="post" onsubmit="go_login(this);return false;">
Вход. Login.&nbsp;&nbsp;&nbsp;&nbsp;<a href="/signup">Регистрация Sign up</a>&nbsp;&nbsp;&nbsp;&nbsp;
<span id="sessRed"></span><br>
<label for="nameId"><strong>Ник. Nickname.</strong> </label>
<div class="inwrapDiv">
<input id="nameId" type="text" name="username" placeholder="your name" value="" required  autocomplete="off"/>
</div>
<label for="parolId"><strong>Пароль. Password.</strong></label>
<div class="inwrapDiv">
<input id="parolId" type="password" name="password" placeholder="Password" value="" required />
</div>
<span onclick="get_forget();" class="foget">Забыли пароль?</span>
<div class="submitDiv">
<input type="submit" value="Войти">
</div>
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
