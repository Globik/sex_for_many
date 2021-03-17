const reset_proto=function(n){
return html`<section id="resetSection" class="">
<form id="mform3" name="mform3" action="/reset" method="post" onsubmit="do_sub(this);return false;">
<header>Восстановление пароля</header>
<span id="sessRed3" class=""></span>
<p class="psuka">Для восстановления пароля укажите адрес электронной почты.</p>

<label for="mailId"><strong>Email</strong></label><span id="mailout"></span>
<div class="inwrap">
<input id="mailIda" type="email" class="login-email" name="email" style="" placeholder="E-mail" value="ag@yandex.ru" required/>
</div>

<div class="submitWrap">
<input type="submit" value="OK">
</div><br><br>
<div class="underform"><strong>Уже есть аккаунт?</strong> <b onclick="get_login();">    <span style="cursor:pointer;">Войти</span></b></div><hr>
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
