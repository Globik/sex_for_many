var l=true;
	var tt=true;
	var f=document.forms.obi;
	f.addEventListener('submit', on_obi, false);
function do_reg(el){
	if(l){
		regelDiv.style.display="inline-block"
		l=false;
		}else{
		regelDiv.style.display="none";l=true;
		suka2.style.display="none";
	suka1.style.display="block";
tt=true;	
		}
}
function remdas(){
regelDiv.style.display="none";
l=true;	
suka2.style.display="none";
suka1.style.display="block";
tt=true;
}

function ba(){
if(tt){
suka1.style.display="none";
suka2.style.display="block";
tt=false;
}else{
	suka2.style.display="none";
	suka1.style.display="block";
tt=true;	
}
}
function on_obi(ev){
ev.preventDefault();
var f1=esci(ev.target.nick.value);
var f2=esci(ev.target.msg.value);
var d={};
d.nick=f1;
d.msg=f2;
vax(ev.target.method, ev.target.action, d, on_obi_saved, on_obi_err, null, false);
}

function on_obi_saved(l){
console.log(l);	
note({content: "Объявление сохранено и отправлено на премодерацию!", type:"info", time: 6});
}

function on_obi_err(l){alert(l);}

function finput(el){
var fi=el.getAttribute('maxlength');
var fi2=el.value.length;
fspan.textContent=Number(fi)-fi2;
}
