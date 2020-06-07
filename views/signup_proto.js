const signup_proto=function(n){
return html`<section id="signupSection" class="tabactive">
<form id="mform2" name="mform2" action="/signup" method="post" onsubmit="go_login2(this);return false;">
<header>Регистpaция</header>
<span id="sessRed2" class=""></span><br>

<label><strong>Твой ник</strong></label>&nbsp;&nbsp;<span id="nameout"></span>
<div class="inpwrap">
<input type="text" class="login-text" name="username" maxlength="20" placeholder="твой ник" value="lo" required/>
</div>

<label for="mailFuck"><strong>Email</strong></label>&nbsp;&nbsp;<span id="mailout"></span>
<div class="inwrap">
<input id="mailFuck" type="email" class="login-email" name="email" style="" placeholder="E-mail" value="ag@yandex.ru" required/>
</div>
<label for="password"><strong>Пароль</strong></label>

<div class="inpwrap">
<input type="password" id="password" name="password"
class="login-pwd" placeholder="Пароль" value="1234"  maxlength="20"/>
<label id="lShow" onclick="show_pwd(this);" title="show password">
<strong id="sShow">показать</strong></label></div>
<small id="smally2" class="blue">Регистрируя аккаунт вы соглашаетесь с <a href="/home/privacy">условиями</a></small>
<div class="inwrapkuku">
<input type="submit" value="Готово">
</div>
<div class="underform"><strong>Уже есть аккаунт?</strong>&nbsp;&nbsp;<b onclick="get_login();">Войти</b></a></div><hr>
</form>
</section>`;	
}
module.exports={signup_proto}
function html(s,...v){
let r='';
for(let i=0;i<v.length;i++){
r+=s[i];
r+=v[i];
}
r+=s[s.length-1];
return r.replace(/\n/g,'');
}
