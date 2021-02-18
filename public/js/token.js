var f=document.forms.yandexform;
f.onsubmit=function(ev){
ev.preventDefault();
//alert(ev.target.label.value);	
alert(ev.target.action);
}
var f2=document.forms.fbtc;
f2.addEventListener('submit', on_fbtc_submit, false);
function on_fbtc_submit(ev){
ev.preventDefault();
var k = ev.target.sbtc.value;
//alert(k);
//alert(ev.target.action+' '+ev.target.method);	
var d = {};
d.btc = k;
d.user_id = ev.target.user_id.value;
d.bname = ev.target.bname.value;
vax(ev.target.method, ev.target.action, d, submit_fbtc, submit_fbtc_err, ev.target, false);
ev.target.className="puls";	
}
function submit_fbtc(l4, ev){
ev.className = "";
//console.log('l4: ', l4);
note({content: l4.info, type: "info", time: 5});	
}
function submit_fbtc_err(l, ev){
ev.className = "";
note({content: l, type: "error", time: 5});	
}
