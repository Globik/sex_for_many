tfile.oninput=function(ev){
	if(!username.textContent){
	alert('give me an user name!');
	return;	
	}
	if(!us_id.textContent){
	alert('gimme an user id!');
	return;	
}
	let a=ev.target;
	console.log(a.files)
	console.log('suka ',ev.target.files[0].name);
	var uploader=new HugeUploader({endpoint:"/fakevideo",file:ev.target.files[0],postParams:{nick:ev.target.files[0].name,
		name:username.textContent,us_id:us_id.textContent}})
	uploader.on('error',function(e){
		console.error(e.detail)
		ferr.textContent=e.detail;
		})
	uploader.on('progress',function(p){
		console.log(p.detail)
		fprogress.textContent=p.detail;
		})
	uploader.on('finish',function(){
	console.log('on finish')
	fertig.textContent="Fertig!";
	})
}
usernameinput.oninput=function(ev){
username.textContent=ev.target.value;	
}
function send_name(el){
	if(!username.textContent){
	alert('give me an user name!');
	return;	
	}
	var d={};
	d.username=username.textContent;
	vax("post","/save_fake_user", d, on_send_name, on_send_name_error, el, false);
	el.className="puls";
}
function on_send_name(l,ev){
ev.className="";
note({content:l.info,type:"info",time:5});
us_id.textContent=l.us_id;	
} 

function on_send_name_error(l,ev){
ev.className="";
note({content:l,type:"error",time:5});
}

var poster_form=document.forms.posterform;
	poster_form.addEventListener('submit', onsubmit, false);
	
	function onsubmit(ev){
	ev.preventDefault();
	try{
	var d=new FormData(poster_form);
	if(!username.textContent){
	alert('give me an user name!');
	return;	
	}
	d.append("nick",username.textContent);	
	vax("post", "/fake_poster", d, on_submit, on_submit_err, ev.target, true);
	ev.target.className="puls";
}catch(e){alert(e)}
	}
	function on_submit(l,ev){
	ev.className="";
	note({content:l.info,type:"info",time:5})
	console.log(l);
	}
	function on_submit_err(l,ev){
	ev.className="";
	note({content:l,type:'error',time:5})	
	}
function save_room_descr(el){
if(!roomdescr.value)return;
if(!username.textContent){
	alert('give me an user name!');
	return;	
	}
var d={};
d.roomdescr=roomdescr.value;
d.username=username.textContent;
el.className="puls";
vax("post","/api/save_room_descr", d, on_save_roomdescr, on_save_roomdescr_error, el, false);
}
function on_save_roomdescr(l,ev){
note({content:l.info,type:"info",time:5})
ev.className="";	
}
function on_save_roomdescr_error(l,ev){
alert(l);
ev.className="";	
}


function save_fake_descr(el){}
function del_fake_video(el){
	
let d={};
d.p=el.getAttribute('data-p');
d.us_id=el.getAttribute('data-vid');
d.src=el.getAttribute('data-src');
d.nick=el.getAttribute('data-nick');
vax("post","/api/del_fake_video", d, on_del_fakevideo, on_del_fakevideo_err, el, false);
el.className="puls";
}
function on_del_fakevideo(l,ev){
note({content:l.info,type:"info",time:5});
let a=document.querySelector('[data-id="'+l.id+'"]');
if(a){a.remove();}
ev.className="";	
}
function on_del_fakevideo_err(l,ev){
note({content:l,type:"error",time:5});
ev.className="";	
}
