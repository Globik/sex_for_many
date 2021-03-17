const login_proto=n=>{
return html`<!-- login_proto.js -->
<section id="loginSection" class="tabactive">
<form id="formLogin" name="mform" action="/login" method="post" onsubmit="go_login(this);return false;">
<span id="sessRed"></span>
<div class="inwrap3">
<label for="nameId"><strong>Ник. Nickname.</strong> </label>
<div class="inwrapDiv">
<input id="nameId" type="text" name="username" placeholder="your name" value="" required  autocomplete="off"/>
</div>
</div>
<div class="inwrap3">
<label for="parolId"><strong>Пароль. Password.</strong></label>
<div class="inwrapDiv">
<input id="parolId" type="password" name="password" placeholder="Password" value="" required />
</div>
</div>
<span onclick="get_forget();" class="foget">Забыли пароль?</span>
<div class="submitDiv">
<input type="submit" name="lsubmit" value="Войти">
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
