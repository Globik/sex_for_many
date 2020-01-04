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
					
