function fetch_folder(el){
	let d={};
	d.folder="reklama";
	vax("post", "/api/fetch_folder", d, on_fetch_folder, on_error, el, false);
	el.className="puls";
	}
	function on_fetch_folder(l, ev){
		ev.className="";
		fcontent.innerHTML = l.data;
		}
		
		function get_info(el){}
		function del_foto(el){
			let d={};
			d.src=el.getAttribute('data-src');
			vax("post", "/api/del_foto", d, on_del_foto, on_error, el, false);
			el.className="puls";
			}
			function on_del_foto(l, ev){
				note({content: l.info, type:"error", time: 5});
				let a=ev.getAttribute('data-pid3');
				if(!a)return;
				let b=document.querySelector('[data-pid="'+a+'"]');
				if(b)b.remove();
				}
			
				var f=document.forms.zform;
				f.addEventListener('submit',on_submit, false);
				function on_submit(ev){
					ev.preventDefault();
			
					var formData=new FormData(f);
					vax(ev.target.method, ev.target.action, formData, on_save_start, on_error, ev.target, true);
				ev.target.className="puls";
					}
					
				
function save_start(el){
	let id=el.getAttribute('data-id');
	var ulstart=document.querySelector('[data-ulstart="'+id+'"]');
if(!ulstart.value){note({content:"start time is empty", type:"error", time:5});return;}
	let d={};
	d.start=ulstart.value;
	d.id=id
	vax("post", "/api/save_start_reklama", d, on_save_start, on_error, el, false);
	el.className="puls";
	}
	function on_save_start(l, ev){
		ev.className="";
		note({content: l.info, type:"info", time: 5});
		}
		function on_error(l,ev){
			ev.className="";
			alert(l);
			}
			
function save_end(el){
	let id=el.getAttribute('data-id');
	var ulend=document.querySelector('[data-ulend="'+id+'"]');
	if(!ulend.value){note({content:"end time is empty", type:"error", time: 5});return;}
	let d={};
	d.end=ulend.value;
	d.id=id;
	vax("post", "/api/save_end_reklama", d, on_save_start, on_error, el, false);
	}
	
function save_opt(el){
	let id=el.getAttribute('data-id');
	var ulselect=document.querySelector('[data-ulselect="'+id+'"]');
	let d={}
	d.opt=ulselect.value;
	d.id=id;
	vax("post", "/api/save_opt_reklama", d, on_save_start, on_error, el, false);
	}
	
		
function save_edit(el){
	let id=el.getAttribute('data-id');
	var ulcontent=document.querySelector('[data-ulcontent="'+id+'"]');
	if(!ulcontent.textContent){note({content:"content is empty", type: "error", time: 5});return;}
	let d={};
	d.content=ulcontent.textContent;
	d.id=id;
	vax("post", "/api/save_content_reklama", d, on_save_start, on_error, el, false);
	}
	
	function del_reklama(el){
		if(confirm("delete it?")){
		let id=el.getAttribute('data-id');
	
	let d={};
	d.id=id;
	vax("post", "/api/del_reklama", d, on_del_reklama, on_error, el, false);
	el.className="start";
}
		}
		function on_del_reklama(l, ev){
			ev.className="";
			note({content: l.info, type: "info", time: 5});
			let id=ev.getAttribute("data-id");
			let ul=document.querySelector('[data-ul="'+id+'"]');
			if(ul)ul.remove();
			}
