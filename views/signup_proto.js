const signup_proto = function(n){
return html`<!-- signup_proto.js --><section id="signupSection">
<form id="mform2" name="mform2" action="/signup" method="post" onsubmit="go_login2(this);return false;">
<span id="sessRed2" class=""></span><br>
<div class="inwrap3">
<label for="yourNicki"><strong>Ваш ник / Your nickname</strong></label>&nbsp;&nbsp;<span id="nameout"></span>
<div class="inpwrap">
<input id="yourNicki" type="text" class="login-text" name="username" maxlength="20" placeholder="твой ник / your nickname"  autocomplete="off" required/>
</div>
</div>
<div class="inwrap3">
<label for="mailFuck"><strong>Email</strong></label>&nbsp;&nbsp;<span id="mailout"></span>
<div class="inpwrap">
<input id="mailFuck" type="email" class="login-email" name="email" style="" placeholder="Email" value="" autocomplete="off" required/>
</div>
</div>
<div class="inwrap3">
<label for="password"><strong>Пароль / Password</strong></label>
<div class="inpwrap" style="position:relative;">
<input type="password" id="password" name="password" class="login-pwd" placeholder="Пароль / Password" maxlength="20"/>

<div id="eye_svg" onclick="show_pwd(this);" title="show password"></div>
</div>
</div>
<div class="inwrap3"><label><strong>Выберите язык / Choose a language</strong></label></div>
<div class="inpwrap"><label class="cntlb">&nbsp;&nbsp;<b style="color:black;">русский</b><input type="radio" name="lang" value="ru"><span class="mark"></span></label>
&nbsp;&nbsp;<label class="cntlb">&nbsp;&nbsp;<b style="color:black;">english</b><input type="radio" name="lang" value="en" checked>
<span class="mark"></span></label></div>
<div class="inwrap3"><label><strong>Промокод / Promo code <small>- получите 50 токенов (0.02 BTC) в подарок</small></strong></label></div>
<div class="inpwrap"><input type="number" name="promocode" max="9999" placeholder="Промокод / Promo code"></div>
<small id="smally2" class="blue">Регистрируя аккаунт вы соглашаетесь с <a href="/home/privacy"><b>условиями - terms of use</b></a></small>
<div class="inwrapkuku">
<input id="submitkuku" type="submit" name="ssubmit" value="Готово / Sign up">
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
