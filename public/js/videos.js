var uv=gid("uservideo");
function del_video(el){
var a=el.getAttribute('data-bid');
var e=el.getAttribute('data-src');
if(!a || !e)return;
if(confirm("Удалить видео?")){
var d={};
d.vid=a;
d.src=e;
vax("post", "/api/video_delete", d, on_video_del, on_video_del_error, el, false);
el.className="puls";
}
}

function on_video_del(l,ev){
ev.className="";
note({content:l.info,type:"info",time:5});	
var s=document.querySelector('[data-id="'+ev.getAttribute('data-bid')+'"]');
if(s)s.remove();
}
function on_video_del_error(l,ev){
ev.className="";
note({content:l,type:"error",time:5});	
}

function get_more_videos(el){
if(!uv.lastChild)return;
var b=uv.lastChild.getAttribute('data-at');
if(!b)return;
var d={};
d.next=b;
vax("post", "/api/get_more_videos", d, on_get_morevideos, on_get_morevideos_error, el, false);
el.className="puls";
}

function on_get_morevideos(l,ev){
ev.className="";
if(!l.content)return;
formi_video_list(l.content);		
}
function on_get_morevideos_error(l,ev){
ev.className="";
note({content:l,type:"error",time:5});	
}
function formi_video_list(arr){
var superuser=gid("superuser");
var frag=document.createDocumentFragment();
arr.forEach(function(el,i){
var videodiv=document.createElement("div");
videodiv.className="newuserdiv";
videodiv.setAttribute("data-id", el.id);
videodiv.setAttribute("data-at", el.cr_at);

var di=new Date(el.cr_at);
var year=di.getFullYear();var month=di.getMonth()+1;var day=di.getDate();
videodiv.innerHTML='<div><span><a href="/webrtc/'+el.usid+'">'+el.nick+'</a></span>&nbsp;<span>'+day+'.'+month+'.'+year+'</span>'+
'<span>Просмотров: </span><span>'+el.v+'</span></div>'+
'<video data-vid="'+el.id+'" src="/vid/'+el.src+'" controls onplay="vplay(this);"></video>'+
'<div>'+(superuser.value=='true'?'<button data-bid="'+el.id+'" data-src="'+el.src+'" onclick="del_video(this);">Удалить</button>':'')+'</div>';
frag.appendChild(videodiv);
});	
uv.appendChild(frag);
}

function vplay(el){
var a=el.getAttribute('data-vid');
if(!a)return;
var d={};
d.vid=a;
vax("post", "/api/video_views", d, on_video_views, on_video_views_error, null, false);
}
function on_video_views(l){
console.log(l);	
}
function on_video_views_error(l){console.error(l);}
