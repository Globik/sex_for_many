tfile.oninput=function(ev){
	if(!username.textContent){
	alert('give me an user name!');
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
	
	
	
	
	
	








