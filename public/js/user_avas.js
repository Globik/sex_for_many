function check_ava(el){
if(el.checked){
var f=el.getAttribute("data-fname");
if(!f)return;
var d={};
d.fname=f;
vax('post','/api/ava-checked',d,on_check_ava,on_check_ava_err,null,false);	
}	
}
function on_check_ava(l){
console.log(l);
var f2=document.querySelector('[data-pname="'+l.info+'"]');
if(f2)f2.remove();	
note({content: l.info+" одобрено!", type:"info", time: 5});
}
function on_check_ava_err(l){
console.error(l);
alert(l);
}
function delete_ava(el){
let l=el.getAttribute('data-dname');
//alert(l);
if(l){
var d={};
d.fname=l;
vax('post','/api/ava-delete', d, on_del_ava, on_check_ava_err,null,false);	
}	
}
function on_del_ava(l){
console.log(l);
var f2=document.querySelector('[data-pname="'+l.info+'"]');
if(f2)f2.remove();	
note({content: "Удалено!", type:"info", time: 5});
}
