const doska=n=>{
	return `
<section id="doska"><header><strong>Доска объявлений</strong></header>
<div id="obiContent"></div>
<a id="doskaA" href="/home/obi">Читать все объявления</a></section>
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
