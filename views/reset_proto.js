const reset_proto=function(n){
return html`<section id="resetSection" class="">
<form id="mform" name="mform" action="/signup" method="post">
<header>Регистрация</header>>
<span id="sessRed" class=""></span><br>

<label><strong>Твой ник</strong></label>&nbsp;&nbsp;<span id="nameout"></span>

<div class="inwrap">
<input type="text" class="login-text" style="" name="username" maxlength="20" placeholder="твой ник" value="lo" required/>
</div>
<label for="mailId"><strong>Email</strong></label><span id="mailout"></span>
<div class="inwrap">
<input id="mailIda" type="email" class="login-email" name="email" style="" placeholder="E-mail" value="ag@yandex.ru" required/>
</div>
<label for="passwordi"><strong>Пароль</strong></label>
<div class="inpwrap">

<input type="password" id="passwordi" name="password" class="login-pwd" placeholder="Пароль" value="1234"  maxlength="20"/>
<label id="lShow" onclick="show_pwd(this);" title="show password">
<strong id="sShow">показать</strong></label></div>
<small id="smally" class="blue">Регистрируя аккаунт вы соглашаетесь с <a href="/home/privacy">условиями</a></small>
<div class="submitWrap">
<input type="submit" value="">
</div><br><br>
<div class="underform"><strong>Уже есть аккаунт?</strong> <a href="/login" style="margin-left:20px;color:blue;"><b>Войти</b></a></div><hr>
</form>
</section>`;
}
module.exports={reset_proto};

function html(s,...v){
let r='';
for(let i=0;i<v.length;i++){
r+=s[i];
r+=v[i];
}
r+=s[s.length-1];
return r.replace(/\n/g,'');
}
