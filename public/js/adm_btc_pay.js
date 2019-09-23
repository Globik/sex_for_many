function is_btc_enabled(el){
//alert(el.checked);
let data={};
data.hi="hi";
vax("post", "/home/profile/enable_btc", data, on_enable_btc, onerror, null, false);	
}

function onerror(l){alert('Error:'+l);}

function on_enable_btc(l,ev){
console.log(l);
//alert(ev.checked);
btc_enabled_span.textContent=l.btc_pay;
btcPayInput.checked=l.btc_pay;
//setTimeout(function(){galert("Pay system "+ l.btc_pay);},100);
note({content:"Pay system "+l.btc_pay,type:"info",time:5});
}
function set_btc_pay(el){
let data={};
data.hi="hi";
vax("post","/home/profile/btc_test",data, on_test_btc, onerror, null,false);
}
function on_test_btc(l){
console.log(l);
btc_test.textContent=l.is_test_btc;
if(l.is_test_btc){
div_test_btc.className="is_test_btc";
div_real_btc.className="";
}else{
div_test_btc.className="";
div_real_btc.className="is_test_btc";
}
}
var disablePayment_event=create_event("if_btc_pay");
saveTestBtn.addEventListener("if_btc_pay", disable_payment, false);
function disable_payment(){
console.log('ok');
if(!btcPayInput.checked){return;}
is_btc_enabled();
}
saveTestBtn.onclick=save_test_btc;

function save_test_btc(el){
//shell(el, "Are you shure to disable payment system?", disablePayment_event);
if(!test_btc_address.value){
let span=crel("span","\tNo btc address provided!","red");
insert_after(span, lbtc,"span");
return;
}
if(!btc_procent.value){
let span=crel("span","\tNo procent provided!","red");
insert_after(span, lproz,"span")
return;
}

let ip=checki_percent(btc_procent.value);
if(!ip){
let span=crel("span","\tMust be integer and less than 50","red");
insert_after(span, lproz, "span");
return;	
}
del_after(lbtc,"span");
del_after(lproz,"span");
if(btcPayInput.checked){shell(el, "Disable payment system? You should.", disablePayment_event);return;}

let data={};
data.test_btc_adr=test_btc_address.value;
data.percent=btc_procent.value;
data.test=true;

vax("post", "/home/profile/save_btc_adr", data, on_saved_test_btc_adr, on_save_test_btc_error, el,false);
}
function on_save_test_btc_error(er, p){
console.log('error: ',er);
let span=crel("span","\t"+er,"red");
insert_after(span, lbtc,"span");
}
function checki_percent(num){
let a=Number(num);
if(a){
if(a<50){return true;}else{return false}	
}else{return false}
}
function reset_test_btc_adr(){
test_btc_address.value="";
del_after(lbtc,"span");
saveTestBtn.disabled=false;
}
function on_saved_test_btc_adr(l,ev){
console.log(l," ", ev.target.disabled);
ev.target.disabled=true;
set_btc_adr(l.test_btc_adr, l.percent, l.test);
}

function save_btc(){
if(!btc_address.value){
let span=crel("span","\tNo btc address provided!","red");
insert_after(span, lbtcreal,"span")
return;
}
if(!btc_procent.value){
let span=crel("span","\tNo procent provided!","red");
insert_after(span, lproz,"span")
return;
}
del_after(lbtcreal,"span");
del_after(lproz,"span");
let data={};

}
function reset_btc_adr(){
btc_address.value="";
del_after(lbtcreal,"span");
del_after(lproz,"span");
}

function set_btc_adr(n,p,t){
console.log(n,"",p,"",t);
if(!n)return;
let data={};
data.test_btc_adr=n;
data.percent=p;
data.test=t;
vax("post","/home/profile/set_btc_adr", data,on_seted_test_btc_adr,onerror,null, false);	
}
function on_seted_test_btc_adr(l){
console.log(l);
//alert(l);
//galert("Your testnet address "+l.test_btc_address+" is installed!");
note({content:"Your testnet address "+l.test_btc_address+" is saved!",type:"success",time:5});
if(!btcPayInput.checked)is_btc_enabled();
}
