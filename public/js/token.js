/* var f=document.forms.yandexform;
f.onsubmit=function(ev){
ev.preventDefault();
//alert(ev.target.label.value);	
alert(ev.target.action);
}
*/ 
var buserId;
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
buserId = d.user_id;
vax(ev.target.method, ev.target.action, d, submit_fbtc, submit_fbtc_err, ev.target, false);
ev.target.className="puls";	
}
var real_btc = 0.008;
function submit_fbtc(l4, ev){
ev.className = "";
console.log('l4: ', l4);
note({content: l4.info, type: "info", time: 5});
set_btc_address(l4.address, l4.bname, l4.btc);	
}
function submit_fbtc_err(l, ev){
ev.className = "";
note({content: l, type: "error", time: 5});	
}
function set_btc_address(address, name, amount){
window.location.href = "#setBTCAddress";	
btcadrspan.textContent = address;
real_btc = (amount == "10" ? 0.008 : amount == "20" ? 0.016 : amount == "50" ? 0.04 : 0.008);
btcamount.textContent = real_btc;
tokamount.textContent = amount;
btchref.innerHTML = "<a href='bitcoin:"+ address +"?amount="+ real_btc + "?label=" + amount +"20%tokens'>"+ address +"</a>";
get_qr(address, real_btc, amount);
open_socket();
}
function get_qr(address, real_btc, amount){
if(qrcode.hasChildNodes()){
	while(qrcode.hasChildNodes()){
		qrcode.removeChild(qrcode.firstChild);
		}
}
new QRCode(gid("qrcode"), {text: address, width:128, height: 128, border:4});	
}
var new_uri;
var socket;
var loc1=location.hostname+':'+location.port;
var loc2=location.hostname;
var loc3=loc1 || loc2;
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}
//open_socket();
function open_socket(){
if(socket){console.log("already in connection");return;}

socket = new WebSocket(new_uri+'//' + loc3+'/'+ BUSERID.value);

socket.onopen = function(){
console.log("websocket opened")
}
socket.onerror = function(e){
console.log("websocket error ", e);
}
socket.onmessage = function(evt){
console.log("message", evt.data);
on_msg(evt.data)
}
socket.onclose = function(){
console.log("Websocket closed");
socket = null;
}
}

function on_msg(data){
var g;
try{
	g = JSON.parse(data);
	}catch(e){
	console.error(e);return;
	}
	if(g.type == "token_buy"){
		console.log("g: ", g);
		var l_str = "Транзакция прошла успешно! У вас " + g.items + " токенов за " + g.amt + " сатошей";
		note({content: l_str, type:"info", time:10});
	erfolgBTC.textContent = l_str;
	erfolgBTC.className = "green";
		setTimeout(function(){
			window.location.href = "/";
			}, 2000);
		}	
}

function test_tok(el){
let d = {};
//usid int, bcode varchar(100),amt int
//invoice, code, address, amount
d.usid = el.getAttribute("data-usid");
console.log(d.usid);
//return;
d.code = "bugygtfg";
d.amount = 80000;
d.invoice = "hgcfdr";
d.address = "jyfrd";
d.test = 1;	
//alert(d.usid);
vax("post", "/api/bitaps_callback/"+d.usid, d, on_test_tok, on_test_tok_err, el, false);
}

function on_test_tok(l, el){
console.log(l);	
}
function on_test_tok_err(l, el){
console.error(l);	
}





