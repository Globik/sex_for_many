/* var f=document.forms.yandexform;
f.onsubmit=function(ev){
ev.preventDefault();
//alert(ev.target.label.value);	
alert(ev.target.action);
}
*/ 
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
}
function get_qr(address, real_btc, amount){
if(qrcode.hasChildNodes()){
	while(qrcode.hasChildNodes()){
		qrcode.removeChild(qrcode.firstChild);
		}
}
new QRCode(gid("qrcode"), {text: address, width:128, height: 128, border:4});	
}

