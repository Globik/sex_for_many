function fetch_folder(el){
	let d={};
	d.folder="reklama";
	vax("post", "/api/fetch_folder", d, on_fetch_folder, on_fetch_error, el, false);
	}
	function on_fetch_folder(l, ev){
		fcontent.innerHTML = l.data;
		}
	function on_fetch_error(l, ev){
		alert(l);
		}
		function get_info(el){}
		function del_foto(el){
			let d={};
			d.src=el.getAttribute('data-src');
			vax("post", "/api/del_foto", d, on_del_foto, on_del_foto_error, el, false);
			}
			function on_del_foto(l, ev){
				note({content: l.info, type:"error", time: 5});
				let a=ev.getAttribute('data-pid3');
				if(!a)return;
				let b=document.querySelector('[data-pid="'+a+'"]');
				if(b)b.remove();
				}
			function on_del_foto_error(l, ev){
				alert(l);
				}
				var f=document.forms.zform;
				f.addEventListener('submit',on_submit, false);
				function on_submit(ev){
					ev.preventDefault();
					//alert(1);
					var formData=new FormData(f);
					vax(ev.target.method, ev.target.action, formData, on_submit_z, on_submit_z_error, ev.target, true);
				
					}
					function on_submit_z(l, ev){
						console.log(l);
					}
					function on_submit_z_error(l, ev){
						alert(l);
					}
