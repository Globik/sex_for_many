function del_users(el){
let d={};
	vax("post", "/api/del_users", d, on_del_users, on_error, el, false);
el.className="puls";
}
function on_del_users(l, ev){
	ev.className="";
	note({content: l.info, type: "info", time: 5});
	}
	function on_error(l, ev){
		alert(l);
		ev.className="";
		}
		
function get_session(){
	vax("post", "/get_session", {}, on_get_session, on_error_session, null, false);
	}
function on_get_session(l){
	outsession.textContent=JSON.stringify(l);
	}
function on_error_session(l){console.error(l)}
