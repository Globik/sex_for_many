const reklama_fold = n=>{
	return `${get_files(n)}`;
	}
	module.exports={reklama_fold}
function get_files(n){
	let s='<ul>';
	if(Array.isArray(n.names)){
		n.names.forEach(function(el,i){
s+=`<li data-pid="${i}"><span>${el}</span><img class="reklama-img" src="/${n.path}/${el}">
<button data-srca="${el}" onclick="get_info(this);">info</button>
<button data-src="${el}" data-pid3="${i}" onclick="del_foto(this);">del</button>`;
			})
		}
		s+='</ul>';
		return s;
	}
