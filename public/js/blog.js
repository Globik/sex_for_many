function rem(el){
	var res=confirm("Удалить пост?");
	if(!res)return;
var a=el.getAttribute("data-bid");
var d={};
d.id=Number(a);
vax("post", "/api/remove_post", d, on_remove_post, on_error, el, false);
	}
function on_error(l,v){
	alert(l);
	}
	function on_remove_post(l,ev){
		note({content:l.info,type:"info",time:5});
		}
