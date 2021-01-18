function del_users(el){
if(confirm("Delete users?")){
let d={};
	vax("post", "/api/del_users", d, on_del_users, on_error, el, false);
el.className="puls";
}
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
function db_total_size(el){
vax("post", "/api/db_total_size", {}, on_db_total_size, on_db_total_size_error, el, false);
el.className="puls";
}
function on_db_total_size(l, ev){
totaldbspan.textContent=l.info.pg_size_pretty;
ev.className="";
}
function on_db_total_size_error(l, ev){
ev.className="";
note({content: l, type: "error", time: 5});
}
function get_table(el){
var a=el.getAttribute("data-table");
vax("post", "/api/table_size", {s:a}, on_table_size, on_db_total_size_error, el, false);
el.className="puls";
}
function on_table_size(l, ev){
ev.className="";
if(l.table=="buser"){
	buser.textContent=l.info.pg_size_pretty;
}else if(l.table=="blog"){
	blog.textContent=l.info.pg_size_pretty;	
}else if(l.table=="chat"){
	chat.textContent=l.info.pg_size_pretty;
}else if(l.table=="cladr"){
	cladr.textContent=l.info.pg_size_pretty;
}else if(l.table=="profile"){
	profile.textContent=l.info.pg_size_pretty;
}else if(l.table=="video"){
	video.textContent=l.info.pg_size_pretty;
}else{}	
}

function send_mail(el){
	let d={};
	d.mail=(gid("email_test").value?gid('email_test').value:'gru5@yandex.ru')
	vax("post", "/send_mail", d, on_send_mail, on_send_mail_err, el, false);
	el.className="puls";
	}
	
	function on_send_mail(l,ev){
		ev.className="";
		note({content:l.info,type:"info",time:5});
		}
	function on_send_mail_err(l,ev){
		note({conntent:l,type:"error",time:5});
		ev.className="";
		}



