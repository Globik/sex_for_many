function is_btc_enabled(el){
let data={};
data.hi="hi";
vax("post", "/home/profile/enable_btc", data, on_enable_btc, onerror, null, false);	
}

function onerror(l){alert('Error:'+l);}

function on_enable_btc(l,ev){
console.log(l);
btc_enabled_span.textContent=l.btc_pay;
btcPayInput.checked=l.btc_pay;
note({content:"Pay system "+l.btc_pay,type:"info",time:5});
}
function set_btc_pay(el){
let data={};
data.hi="hi";
vax("post","/home/profile/btc_test", data, on_test_btc, onerror, null,false);
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

saveTestBtcBtn.addEventListener("if_btc_pay", disable_payment, false);
saveBtcBtn.addEventListener("if_btc_pay", disable_payment, false);

function disable_payment(){
console.log('ok');
if(!btcPayInput.checked){return;}
is_btc_enabled();
}

saveTestBtcBtn.onclick=save_test_btc;
saveBtcBtn.onclick=save_btc;

function save_test_btc(el){
if(!test_btc_address.value){
let span=crel("span","\tNo btc address provided!","red");
insert_after(span, lbtctest, "span");
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
del_after(lbtctest,"span");
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
insert_after(span, lbtctest,"span");
}

function checki_percent(num){
let a=Number(num);
if(a){
if(a<50){return true;}else{return false}	
}else{return false}
}
function reset_test_btc_adr(){
test_btc_address.value="";
del_after(lbtctest,"span");
saveTestBtcBtn.disabled=false;
}
function on_saved_test_btc_adr(l,ev){
console.log(l," ", ev.target.disabled);
ev.target.disabled=true;
set_btc_adr(l.test_btc_adr, l.percent, l.test);
}

function save_btc(el){
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
let ip=checki_percent(btc_procent.value);
if(!ip){
let span=crel("span","\tMust be integer and less than 50","red");
insert_after(span, lproz, "span");
return;	
}
if(btcPayInput.checked){shell(el, "Disable payment system? You should.", disablePayment_event);return;}
let data={};
data.test_btc_adr = btc_address.value;
//alert(btc_address.value);
data.percent = btc_procent.value;
data.test = false;
vax("post", "/home/profile/save_btc_adr", data, on_saved_btc_adr, on_save_btc_error, el, false);
}
function reset_btc_adr(){
btc_address.value="";
del_after(lbtcreal,"span");
del_after(lproz,"span");
saveBtcBtn.disabled=false;
}

function on_save_btc_error(er, p){
console.log('error: ',er);
let span=crel("span","\t"+er,"red");
insert_after(span, lbtcreal,"span");
}

function on_saved_btc_adr(l,ev){
console.log(l," ", ev.target.disabled);
ev.target.disabled = true;
set_btc_adr(l.test_btc_adr, l.percent, l.test);
}

function set_btc_adr(n,p,t){
console.log(n, "", p, "", t);
if(!n)return;
let data={};
data.test_btc_adr=n;
data.percent=p;
data.test=t;
vax("post","/home/profile/set_btc_adr", data, on_seted_test_btc_adr, onerror, null, false);	
}

function on_seted_test_btc_adr(l){
console.log(l);
//alert(JSON.stringify(l));
note({content:"Your BTC address "+l.btc_address+" is saved!",type:"success",time:5});
if(!btcPayInput.checked)is_btc_enabled();
}
