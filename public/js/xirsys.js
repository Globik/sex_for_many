var xiri;
function get_xirsys(el){
	let d = {};
	vax("post", "/api/get_xirsys", d, on_get_xirsys, on_xirsys_error, el, false);
	el.className = "puls";
	}

function set_xirsys(el){
	if(!xiri){
				note({content: "No xiri", type: "error", time: 5});
				return;
				}
	let d = {};
	d.xir = xiri;
	vax("post", "/api/set_xirsys", d, on_set_xirsys, on_xirsys_error, el, false);
	}
	
	function on_get_xirsys(l,ev){
		ev.className = "";
		xir.className = "momentan";
		try{
			xiri = l.xir;
		var v = JSON.stringify(l.xir);
		xir.textContent = v;
	}catch(e){console.log(e);}
		}
		
		function on_set_xirsys(l, ev){
ev.className = "";
xir.className ="stable";
		try{
			xiri = l.xir;
		var v = JSON.stringify(l.xir);
		xir.textContent = v;
		note({content:"OK, setted!", type: "info", time: 5});
	}catch(e){console.log(e);}
			}
	
	function on_xirsys_error(l,ev){
		ev.className = "";
		alert(l);
		}
		
function get_subscribe(){
  var OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "ebc1d04b-30f9-4168-b7e7-f5b9c6780e40",
    });
    OneSignal.setExternalUserId("1");
  });
}

function save_ya_sec(el){
	if(!yaSec.value){
		note({content: "Yandex secret is empty!", type: "error", time: 5});
		return;
		}
		let d = {};
		d.yasec = yaSec.value;
		vax("post", "/api/set_ya_sec", d, on_save_ya_sec, on_save_ya_sec_error, el, false);
		el.className = "puls";
	}
	
	function on_save_ya_sec(l, ev){
		ev.className = "";
		note({content: l.info, type: "info", time: 5});
		yaSec.value = l.yasec;
		}
	
	function on_save_ya_sec_error(l, ev){
		ev.className = "";
		note({content: l, type : "error", time: 5});
		}

function save_xir_sec(el){
	if(!xirSec.value){
		note({content: "Xirsys secret is empty!", type: "error", time: 5});
		return;
		}
		let d = {};
		d.xirsec = xirSec.value;
		vax("post", "/api/set_xir_sec", d, on_save_xir_sec, on_save_xir_sec_error, el, false);
		el.className = "puls";
	}
	
	function on_save_xir_sec(l, ev){
		ev.className = "";
		note({content: l.info, type: "info", time: 5});
		xirSec.value = l.xirsec;
		}
	
	function on_save_xir_sec_error(l, ev){
		ev.className = "";
		note({content: l, type: "error", time: 5});
		}
