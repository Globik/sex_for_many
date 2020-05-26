function del_video_f(el){
let a=el.getAttribute('data-src');
if(!a)return;
if(confirm("Удалить?")){
let d={};
d.src=a;
vax("post", "/api/del_video_f", d, on_del_video_f, on_del_video_f_error, el, false);	
el.className="puls";
}
}
function on_del_video_f(l, ev){
ev.className="";
note({content: l.info, type: "info", time: 5});	
if(!l.src)return;
remove_video_f(l.src);
}
function on_del_video_f_error(l, ev){
ev.className="";
note({content: l, type: "error", time: 5});	
}

function remove_video_f(src){
let a=document.querySelector('[data-srcF="' + src + '"]');
if(!a)return;
a.remove();
}
