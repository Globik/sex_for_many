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
	//console.log(l);
	//outsession.textContent=JSON.stringify(l);
	l.res.forEach(function(el, i){
	outsession.innerHTML+=(el.session.ua?el.session.ua:'')+'<br>'+(el.session.ref?el.session.ref:'')+'<br>';	
	})
	}
function on_error_session(l){console.error(l)}
