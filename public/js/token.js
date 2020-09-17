var f=document.forms.yandexform;
f.onsubmit=function(ev){
ev.preventDefault();
//alert(ev.target.label.value);	
alert(ev.target.action);
}
