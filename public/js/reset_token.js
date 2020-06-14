var pwd=gid("pwd");
var form=document.forms.resetform;
form.onsubmit=on_submit;
function on_submit(ev){
ev.preventDefault();
var d={};
d.email=ev.target.email.value;
d.password=ev.target.password.value;
d.token=ev.target.token.value;
//alert(JSON.stringify(d));
vax(ev.target.method, ev.target.action, d, on_get_submit, on_get_submit_error, ev.target,false);
ev.target.className="puls";	
}
function on_get_submit(l, ev){
sessRed.innerHTML=l.info;
ev.className="";
} 
function on_get_submit_error(l, ev){
ev.className="";
sessRed.innerHTML=l;	
}
function show_pwd(){
if(pwd.value){
if(pwd.type=="password"){
pwd.type="text";
}else{pwd.type="password"}
}
}
