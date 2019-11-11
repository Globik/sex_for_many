
var ws=null;
var usname=username.textConent;
var loc1=location.hostname+':'+location.port;
var loc2='frozen-atoll-47887.herokuapp.com';
var loc3=loc1 || loc2;
var new_uri;
//var btcForm=document.forms.btcForm;
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}
function get_socket(){
if(!window.WebSocket)return;
if(ws){console.log("ws already opened");retrun;}
ws=new WebSocket(new_uri+'//'+loc3+'/'+usname);
ws.onerror=function(e){out.innerHTML+="<b>socket error: </b>"+e+"<br>";}
ws.onopen=function(){out.innerHTML+="<b>websocket opened!</b><br>";}
ws.onclose=function(){out.innerHTML+="<b>websocket closed!</b><br>";}
ws.onmessage=on_message;
}
get_socket();
function on_message(evt){
try{
var msg=JSON.parse(evt.data);
out.innerHTML+=evt.data+"<br>";
}catch(e){console.warn("error json parse");return;}
if(msg.type=="msg"){

}else{console.warn("unknown type");}
}
function send(){
if(!chatxt.value)return;
let d={};
d.type="msg";
d.msg=chatxt.value;
wsend(d);
}

if(btcForm){
// save btc address
btcForm.addEventListener('submit',on_btc_submit_form, false);	
btcForm.addEventListener('reset', on_btc_reset, false);
}

function on_btc_submit_form(ev){
	try{
//if(!supportFormData()) return;
ev.preventDefault();

var f2=ev.target.btcadr;
var f3=ev.target.submit;
let m={};
m.btc_client=f2.value;
//m.is_testnet=true;
m.username=ev.target.username.value;
console.log(m);
vax(ev.target.method,ev.target.action, m, form_btc_ondata, onerror,ev,false);
//f3.disabled=true;
if(f2){
f2.className="wait";
}	
}catch(e){alert(e);}
}



function onerror(e){console.log("error: ",e);}
function on_btc_reset(ev){}
function form_btc_ondata(data,ev){console.log(data);
publicbtc.href="bitcoin:"+data.bod.address;
publicbtc.textContent=data.bod.address;	
}

function wsend(d){
if(!ws)return;
let m;
try{
m=JSON.stringify(d);
ws.send(m);
}catch(e){console.warn("err json stringify");}
}

function test_cb(){
let data={};
data.received_amount=200;
data.invoice="invQ67P7jvsWDNQ4EY2ZnA4qbB75UY7RWpcZrnycaTzfgfz2iYUiD";
data.code= "PMTvLqJhBnFJexwS1MqPPF6uJ8cLbYh87Re6Qz4wirnYiXrAojuBk";//payment code
data.amount=4;//payment amount
data.address="2NDbrgcoVvSXjQzk7ZUQCgx5QD5SXbw1y45"//public btc address for smart contract
vax("post","/api/test_cb_smartc",data,on_test_cb,onerror,null,false);	
}
function on_test_cb(data,ev){
console.log(data);	
}
