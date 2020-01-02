function redaktiert(el){
rForm.style.display="block";
rText.textContent=rArticle.innerHTML;	
}
var lf=document.forms.rform;
lf.addEventListener('submit', on_submit, false);

function on_submit(ev){
	try{
ev.preventDefault();
if(!ev.target.rtext.value){note({content: "No text", type:"error", time: 5});return;}
let d={};
d.art=ev.target.rtext.value;
vax(ev.target.method, ev.target.action, d, on_submit_ads, on_err, ev.target, false);
ev.target.className="puls";
}catch(e){alert(e);}
}

function on_submit_ads(l, ev){
ev.className="";
note({content:l.info,type:"info",time:5});
rArticle.innerHTML=rText.value;	
console.log(rText.value.length);
rForm.style.display="none";
	}
function on_err(l, ev){ev.className="";alert(l);}
