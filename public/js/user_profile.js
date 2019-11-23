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
fotoTxt.value=rc;
}
}
function get_natural(ev){
var im=document.getElementById("myPhoto");
if(!im)return;
return {w:im.naturalWidth,h:im.naturalHeight};
}
function on_submit(ev){
ev.preventDefault();
var f=ev.target.txt_msg;
var f2=ev.target.age;
var f3=ev.target.photo;
alert(f3.value);	
}
function del_foto(){
figFoto.remove();
}
