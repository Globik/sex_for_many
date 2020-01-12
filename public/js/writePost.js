//try{
var f=document.forms.postform;

f.addEventListener('submit',on_submit, false);
				function on_submit(ev){
					//ev.preventDefault();
					try{
					ev.preventDefault();
			
					var formData=new FormData(f);
					vax(ev.target.method, ev.target.action, formData, on_submiti, on_error, ev.target, true);
				ev.target.className="puls";
			}catch(e){alert(e);ev.preventDefault();}
					}
					function on_submiti(l, ev){
						note({content: l.info, type: "info", time: 5});
						ev.className="";
						}
						function on_error(l, ev){
							alert(l);
							ev.className="";
							}
						//}catch(e){alert(e);}
					
var pform=document.forms.formw;
pform.addEventListener("submit", do_submit,false);
function do_submit(ev){
ev.preventDefault();	
var formData=new FormData(pform);
vax(ev.target.method, ev.target.action, formData, on_save_foto, on_error, ev.target, true);
ev.target.className="puls";
}

function on_save_foto(l,ev){
	ev.className="";
	note({content:l.info,type:"info",time:5});
	//alert(3)
	do_inline_foto(l);
	}

function do_inline_foto(l){
	//alert(2)
	let img=document.createElement("img");
	img.src='/blog/'+l.src;
	img.title=img.src;
	gid('inlineFoto').appendChild(img);
	//alert(1);
}

var fetch_flag=false;
function fetch_folder(el){
	if(!fetch_flag){
	let d={};
	d.folder="blog";
	vax("post", "/api/fetch_folder", d, on_fetch_folder, on_error, el, false);
	el.className="puls";
	fetch_flag=true;
}else{
	if(fcontent)fcontent.innerHTML="";
	fetch_flag=false;
	}
	}
	function on_fetch_folder(l, ev){
		ev.className="";
		fcontent.innerHTML = l.data;
		}
