var profile_form=document.forms.fprofi;
	profile_form.addEventListener('submit', on_submit, false);
function thumb(ev){
while(preview.firstChild){preview.removeChild(preview.firstChild);}
var img=document.createElement('img');
var cnv=document.createElement('canvas');
var ctx=cnv.getContext('2d');
img.src=window.URL.createObjectURL(ev[0]);
img.id="myPhoto";
img.height=200;
preview.appendChild(img);
img.onload=function(){window.URL.revokeObjectURL(this.src);
var l=get_natural();
if(l)
var wi=(l.w > 1000 ? l.w/4: l.w);
var hi=(l.w > 1000 ? l.h/4:l.h);
cnv.width=wi;
cnv.height=hi;
ctx.drawImage(img,0,0,wi,hi);
var rc=cnv.toDataURL('image/png',0.5);
//fotoTxt.value=rc;
}
}
function get_natural(ev){
var im=document.getElementById("myPhoto");
if(!im)return;
return {w:im.naturalWidth,h:im.naturalHeight};
}
function on_submit(ev){
ev.preventDefault();
var f2=ev.target.age;
var f3=ev.target.photo;
var f4=ev.target.fname;
var f5=fcont;
var d={};
d.age=f2.value;
d.photo='f3.value';
d.fname=f4.value;
d.city=ev.target.city.value;
d.gay=ev.target.gay.value;
d.txt_msg=esci(f5.textContent);
var dich=new FormData(profile_form);
dich.append('txt_msg',d.txt_msg);
vax(ev.target.method, ev.target.action, dich, on_profile_saved, on_profile_err, ev.target, true);
ev.target.className="puls";
}
function on_profile_saved(l,ev){
console.log(l);
ev.className="";
note({content: l.info, type:"info", time: 5});
}
function on_profile_err(l,ev){ev.className="";note({content: l, type:"error", time: 5});}

function del_foto(el){
var d={};
d.fname=el.getAttribute("data-fname");
d.src=el.getAttribute('data-src');
vax('post','/api/del_ava',d,on_del_ava,on_err_ava,null,false);
}

function on_del_ava(l){
console.log(l);
figFoto.remove();	
fotoTxt.value="";
note({content: l.info, type:"info", time: 5});
}

function on_err_ava(l){
alert(l);
}

function finput(el){
var fi=el.getAttribute('data-max');
var fi2=el.textContent.length;
fspan.textContent=Number(fi)-fi2;
}
