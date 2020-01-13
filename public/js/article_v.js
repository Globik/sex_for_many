function edit_article(el){
	txtContainer.style.display="block";
	articleHeader.setAttribute('contenteditable', true)
	rText.textContent=articleView.innerHTML;
	}
function save_das(el){
	if(!rText.value) return;
	articleHeader.setAttribute('contenteditable', false)
	let d={};
	d.text=rText.value;
	d.title=articleHeader.textContent;
	d.descr=rMeta.value;
	//alert(rMeta.value); descr
	d.id=articleHeader.getAttribute("data-id")
vax("post", '/api/save_blog', d, on_save_das, on_err, el, false);	
el.className="puls";
	}
	
	function on_save_das(l, ev){
		ev.className="";
note({content:l.info,type:"info",time:5});
//window.location.href="/home/blog";
		}
		/*function on_err(l,ev){
			ev.className="";
			alert(l);
			}*/
var pform=document.forms.formw;
pform.addEventListener("submit", do_submit,false);
function do_submit(ev){
ev.preventDefault();	
var formDatai=new FormData(pform);
vax(ev.target.method, ev.target.action, formDatai, on_save_foto, on_err, ev.target, true);
ev.target.className="puls";
}
function on_err(l,ev){
			ev.className="";
			alert(l);
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




