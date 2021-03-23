const get_payout = function(n, one_token_btc){
let s='';
n.forEach(function(el,i){
s+=`<form method="post" action="/api/payout_money" name="suka">
<div class="pdiv"><label>id: </label><br><input type="number" disabled name="id" value="${el.id}"></div>
<div class="pdiv"><label>email: </label><br><input type="email" disabled name="email" value="${el.email}"></div>
<div class="pdiv"><label for="rublinput${i}">[${el.items} / ${(el.items*el.proz)/100}] => Отстегнуть биткоинов: </label><br>
<input id="rublinput${i}" name="amount" type="number" value="${((el.items*el.proz)/100)*one_token_btc}" required></div>
<div class="pdiv"><label>Биткоин адрес: <a href="bitcoin:${el.cadr}?amount=${((el.items*el.proz)/100)*one_token_btc}?label=${(el.items*el.proz)/100}20%${el.bname}">${el.cadr}?amount=${((el.items*el.proz)/100)*one_token_btc}?label=${(el.items*el.proz)/100} ${el.bname}</a>
</label><br><input type="text" name="bcard" value="${el.cadr}" disabled></div>
<div class="pdiv"><label>Ник: </label><br><input type="text" name="bname" value="${el.bname}" disabled></div>
<div class="pdiv"><input type="submit" value="Отстегнул" name="psubmit"></div></form><hr>`;	
})
return s;
	}
	module.exports = {get_payout}
