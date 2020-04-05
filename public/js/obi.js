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
var f3=ev.target.nid.value;
var f1=esci(ev.target.nick.value);
var f2=esci(ev.target.msg.value)+(f3?'<br><a href="/webrtc/'+f3+'">Мой профайл</a>':'') ;

var d={};
d.nick=f1;
d.msg=f2;
vax(ev.target.method, ev.target.action, d, on_obi_saved, on_obi_err, ev.target, false);
ev.target.className="puls";
}

function on_obi_saved(l, ev){
console.log(l);	
ev.className="";
note({content: "Объявление сохранено.", type:"info", time: 6});
//l.nick msg
//<div data-id="${el.id}" class="chelobi"><header><b>${el.bnick}</b></header><p class="chelp">${el.msg}</p>
//<div>${moment(el.ati).format('YYYY-MM-DD hh:mm')}</div>
var div=document.createElement('div');
div.setAttribute('data-id',l.id);
div.className="chelobi";
div.innerHTML='<header><b>'+l.nick+'</b></header><p class="chelp">'+l.msg+'</p><button class="del-obi" data-vid="'+l.id+'" onclick="del_obi2(this);">удалить объявление</button>';
fuckSection.appendChild(div);
}

function del_obi(el){
	var id=el.getAttribute('data-vid');
	if(!id)return;
	var d={};
	d.id=id;
	vax("post", "/api/del_obi", d, on_obi_del, on_obi_err, el, false);
	el.className="puls";
	}

function on_obi_del(l, ev){
	ev.className="";
	note({content: l.info, type: "info",time:5});
	var f2=document.querySelector('[data-id="'+l.id+'"]');
	if(f2)f2.remove();
}
function del_obi2(el){
	var id=el.getAttribute('data-vid');
	if(!id)return;
	var d={};
	d.id=id;
	vax("post", "/api/cust_del_obi", d, on_obi_del, on_obi_err, el, false);
	el.className="puls";
	}
function on_obi_err(l, ev){
	//alert(l);
	ev.className="";
	note({content: l, type: "error", time: 5});
	}

function finput(el){
var fi=el.getAttribute('maxlength');
var fi2=el.value.length;
fspan.textContent=Number(fi)-fi2;
}
