const doska = n=>{
	return `
<section id="doska"><header><strong>${n.user?n.user.lng=='ru'?'Доска объявлений':'Message board':'Доска объявлений'}</strong></header>
<div id="obiContent"></div>
<a id="doskaA" href="/obi">${n.user?n.user.lng=='ru'?'Читать все объявления':'Read all messages':'Читать все объявления'}</a>&nbsp;&nbsp;
<a id="doskaB" href="/obi#obiContainer">${n.user?n.user.lng=='ru'?'Подать объявление':'Write a message':'Подать объявление'}</a><br>
</section>
<script>
var obiContent=gid("obiContent");
setTimeout(function(){fetchObiContent();},1000);
function fetchObiContent(){
vax("post", "/api/fetch_obi_content", {}, on_fetch_obi, on_fetch_obi_error, null,false);
}
function on_fetch_obi(l){
if(!l.r)return;
obiContent.innerHTML=l.r.msg;
}
function on_fetch_obi_error(l){
console.error(l);
}
</script>
`;
}
module.exports = {doska};
