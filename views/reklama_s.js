function get_banner(n){
	// 1024x127
	let s='';
	n.forEach(function(el, i){
	if(el.typ==1){
s+=`<a href="${el.href}" data-cid="${el.id}" onclick="mach_click(this);" target="_blank"><img src="/reklama/${el.src}"/></a>`;
	}	
	})
	return s;
	}
function get_banner_podval(n){
	//1024x853
let s='';
n.forEach(function(el,i){
if(el.typ==2){
s+=`<div class="f"><a class="a" href="${el.href}" data-cid="${el.id}" onclick="mach_click(this);" 
 target="_blank"><img class="img" src="/reklama/${el.src}"/></a></div>`;
}
})
return s;	
}
module.exports={get_banner, get_banner_podval}
