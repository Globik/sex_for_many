var lokl = document.querySelectorAll("form[name=suka]");

for(var i = 0; i < lokl.length; i++){
var du4 = lokl[i];
du4.addEventListener('submit', set_payment, false);
}
 
function set_payment(el){
el.preventDefault();
try{
//alert(el.target.action+el.target.method+el.target.bname.value+el.target.bcard.value+el.target.amount.value);
if(el.target.amount.value == "0"){note({content: "already done!", type: "error", time: 5});return;}
let d = {};
d.id = el.target.id.value;
d.bname = el.target.bname.value;
d.bcard = el.target.bcard.value;
d.amount = el.target.amount.value;
d.email = el.target.email.value;
vax(el.target.method, el.target.action, d, on_set_payment, on_set_payment_error, el.target, false);
el.target.psubmit.className = "puls";
}catch(e){alert(e)}
}
function on_set_payment(l,el){
note({content: l.info, type: "info", time: 5});
el.amount.value = 0;
el.psubmit.className = "";	
el.className = "pink";
el.disabled = true;
el.psubmit.disabled = true;
}
function on_set_payment_error(l,el){
note({content:l,type:"error",time:5});
el.psubmit.className = "";	
}
