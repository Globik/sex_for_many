var xiri;
function get_xirsys(el){
	let d={};
	vax("post", "/api/get_xirsys", d, on_get_xirsys, on_xirsys_error, el,false);
	el.className="puls";
	}

function set_xirsys(el){
	if(!xiri){
				note({content:"No xiri",type:"error", time: 5});
				return;
				}
	let d={};
	d.xir=xiri;
	vax("post", "/api/set_xirsys", d, on_set_xirsys, on_xirsys_error, el,false);
	}
	
	function on_get_xirsys(l,ev){
		ev.className="";
		xir.className="momentan";
		try{
			xiri = l.xir;
		var v=JSON.stringify(l.xir);
		xir.textContent=v;
	}catch(e){console.log(e);}
		}
		
		function on_set_xirsys(l, ev){
ev.className="";
xir.className="stable";
		try{
			xiri = l.xir;
		var v=JSON.stringify(l.xir);
		xir.textContent=v;
	}catch(e){console.log(e);}
			}
	
	function on_xirsys_error(l,ev){
		ev.className="";
		alert(l);
		}
