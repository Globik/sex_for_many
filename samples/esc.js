var htmls={
	'&':'&amp',
	'<':'&lt;',
	'>':'&gt;',
	'"':'&quot;',
	"'":'&#x27;',
	'/':'&#x2F;'
	}
	var er=/[&<>"'\/]/g;
	esc=function(str){
		return (''+str).replace(er,function(m){return htmls[m];});
		}
		let a='<mama></script>';
		let b=esc(a);
		console.log(b);
