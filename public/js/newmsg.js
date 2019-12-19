function check_msg(el){
let id=el.getAttribute('data-mid');
if(id){
	let d={};
	d.id=id;
	vax('post','/api/ok_msg',d, on_ok_msg, on_err_msg, null, false);
}
}
function del_msg(el){
let id=el.getAttribute('data-did');
if(id){
	let d={};
	d.id=id;
	vax('post','/api/del_msg', d, on_del_msg, on_err_msg, null, false);
}	
}
function on_err_msg(l){
	alert(l);
}
function on_ok_msg(l){
console.log(l);
let f=document.querySelector("[data-id='"+l.id+"']");
if(f){f.classList.add("lightgreen");}	
}
function on_del_msg(l){
console.log(l);	
let f=document.querySelector("[data-id='"+l.id+"']");
if(f){f.remove();}
}

