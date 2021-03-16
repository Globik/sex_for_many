const signup_proto = function(n){
return html`<!-- signup_proto.js --><section id="signupSection" class="">
<form id="mform2" name="mform2" action="/signup" method="post" onsubmit="go_login2(this);return false;">
<header>Регистpaция / Sign up</header>
<span id="sessRed2" class=""></span><br>

<label><strong>Твой ник / Your nickname</strong></label>&nbsp;&nbsp;<span id="nameout"></span>
<div class="inpwrap">
<input type="text" class="login-text" name="username" maxlength="20" placeholder="твой ник / your nickname"  autocomplete="off" required/>
</div>

<label for="mailFuck"><strong>Email</strong></label>&nbsp;&nbsp;<span id="mailout"></span>
<div class="inwrap">
<input id="mailFuck" type="email" class="login-email" name="email" style="" placeholder="Your E-mail" value="" autocomplete="off" required/>
</div>
<label for="password"><strong>Пароль / Password</strong></label>

<div class="inpwrap">
<input type="password" id="password" name="password"
class="login-pwd" placeholder="Пароль / Password" maxlength="20" autocomplete="new-password"/>
<label id="lShow" onclick="show_pwd(this);" title="show password">
<strong id="sShow"><small>показать / show password</small></strong></label></div>
<div class="inwrap3"><label><strong>Выберите язык / Choose a language</strong></label></div>
<div class="inwrap"><label class="cntlb"><b>русский</b><input type="radio" name="lang" value="ru"><span class="mark"></span></label></div>
<div class="inwrap"><label class="cntlb"><b>english</b><input type="radio" name="lang" value="en" checked><span class="mark"></span></label></div>
<div class="inwrap3"><label><strong>Промокод / Promo code</strong></label></div>
<div class="inwrap"><input type="number" name="promocode"></div>
<small id="smally2" class="blue">Регистрируя аккаунт вы соглашаетесь с <a href="/home/privacy">условиями - terms of use</a></small>
<div class="inwrapkuku">
<input id="submitkuku" type="submit" value="Готово Sign up">
</div>
<div class="underform"></div><hr>
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
