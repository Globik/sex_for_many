const doska=n=>{
	return `
<section id="doska"><header><strong>Доска объявлений</strong></header><h3>Message board</h3>
<div id="obiContent"></div>
<a id="doskaA" href="/obi">Читать все объявления</a>  <a id="doskaB" href="/obi#obiContainer">Подать объявление</a><br>
<a id="doskaC" href="/obi">Read all messages</a>  <a id="doskaD" href="/obi#obiContainer">Write a message</a>
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
module.exports={doska};
