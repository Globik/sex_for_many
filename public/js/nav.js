var duri=gid("duri"),
//elmini=gid("operamini-menu-selector"),
minmen=gid('miniMenu'),
lb=gid('lb-menu-all'),dsel=document.querySelectorAll('label .spinner');
var mainP=gid('enc');
var gr=true;
function dowas1(){
if(gr){
minmen.style.display="block";
minmen.style.zIndex="3";
//lb.classList.add('active');
gad(dsel,'active');
gr=false;
}else{
minmen.style.display="none";
minmen.style.zIndex="0";
//lb.classList.remove('active');
sumor(dsel,'active');
gr=true;}
}
document.body.onload=shalter;

function shalter(){
gid('pagewrap').onclick=clickshalter;
gid('pagewrap').ontouch=clickshalter;
var dlg=gid('dialogConfirm');
if(flexsupport==false){if(dlg) dlg.style.display="none";}
function clickshalter(e){
	minmen.style.display="none";
	sumor(dsel,'active');
gr=true;
}}
/*
var isOperaMini = (navigator.userAgent.indexOf('Opera Mini')>-1);
if(isOperaMini){
duri.style.display="none";
elmini.style.display="block";}
*/
function sumor(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.remove(clas);
}
}
function gad(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.add(clas);
}
}

