// sex_for_many
'use strict';
function is_local_storage(){return (typeof(Storage) !=='undefined'?true:false);}
function is_dialogi(){return (typeof HTMLDialogElement==='function'?true:false);}
function bzuka(el,n,ml){
gid('inbox3').innerHTML='<b>'+n+'</b>';
dialogConfirm.showModal();
dialogConfirm.onclose=function(ev){
ev.target.returnValue=='true'?luzda(el,ml):null;
ev.target.returnValue=null;
}}
function shell(el,n,ml){is_dialogi()?bzuka(el,n,ml):puzuki(el,n,ml);}
function puzuki(el,n,ml){confirm(n)?luzda(el,ml):null}
function luzda(el,ml){(el?el.target.dispatchEvent(ml):pizda(ml));}
function galert(n){
var c=window.getComputedStyle(document.querySelector('.popi'),null).getPropertyValue('z-index');
inbox2.innerHTML='<b>'+n+'</b>';
if(c)gid('alert_id').style.zIndex=c+1;
gid('alert_id').classList.add('ak');
setTimeout(function(){
gid('alert_id').classList.remove('ak');
},5000)
}
function open_al(){
gid('message_box').onclick=function(e){
in_rem_hash();
}}
function in_rem_hash(){setTimeout(function(){rem_hash();},0);}
function rem_hash(){
if(history)history.pushState('',null,window.location.pathname);}
function message_box(n){
console.log('mess: ',n)
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
open_al();
}
function vax(m,u,d,o,z,pointer,bool){
var x=new XMLHttpRequest();if(!x){return;}x.open(m,u);
x.setRequestHeader('Cache-Control','no-cache');
if(!bool){console.log('json');x.setRequestHeader('Content-Type','application/json','utf-8');}
x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload=function(e){
x.status==200?o(demiss(this.response || this.responseText),pointer):z(this.response || this.responseText,pointer)};
x.onerror=function(e){alert(e)};
if(!bool){var v=miss(d);console.log('sending json');x.send(v);}else{x.send(d)}}

function miss(n){var a;try{a=JSON.stringify(n);return a;}catch(er){throw er;}}
function demiss(n){var b;try{b=JSON.parse(n);return b;}catch(er){return n;}}
function create_event(name){
var makaka23=null;
try{
makaka23=new Event(name);return makaka23;
}catch(e){
makaka23=document.createEvent('Event');
makaka23.initEvent(name,true,true);
return makaka23;
}
return makaka23;
}
function gid(id){return document.getElementById(id);}
function supportFormData(){return !! window.FormData;}
function crel(tagname,text,className){var eli=document.createElement(tagname);eli.textContent=text;eli.className=className;return eli;}
function insert_after(newnode, refnode,tagname){
try{
del_after(refnode, tagname);
refnode.parentNode.insertBefore(newnode,refnode.nextSibling);
}catch(e){console.log(e);}
}
function del_after(refnode, tagname){
if(!refnode.nextSibling)return;
if(refnode.nextSibling.tagName==tagname.toUpperCase())refnode.parentNode.removeChild(refnode.nextSibling);	
}


!function(d) {

  "use strict";

  /**
   * Полифилл для Object.assign()
   */
  Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e,r){"use strict";if(null==e)throw new TypeError("Cannot convert first argument to object");for(var t=Object(e),n=1;n<arguments.length;n++){var o=arguments[n];if(null!=o)for(var a=Object.keys(Object(o)),c=0,b=a.length;c<b;c++){var i=a[c],l=Object.getOwnPropertyDescriptor(o,i);void 0!==l&&l.enumerable&&(t[i]=o[i])}}return t}});

  /**
   * Полифилл для Element.remove()
   */
  "remove" in Element.prototype||(Element.prototype.remove=function(){this.parentNode&&this.parentNode.removeChild(this)});

  /**
   * Основная функция.
   * @param {Object} [settings] - предвартиельные настройки
   */
  window.note = function(settings) {

    /**
     * Настройки по умолчанию
     */
    settings = Object.assign({},{
      callback:    false,
      content:     "",
      time:        4.5,
      type:        "info"
    }, settings);

    if(!settings.content.length) return;

    /**
     * Функция создания элементов
     * @param {String} name - название DOM-элемента
     * @param {Object} attr - объект с атрибутами
     * @param {Object} append - DOM-элемент, в который будет добавлен новый узел
     * @param {String} [content] - контент DOM-элемента
     */
    var create = function(name, attr, append, content) {
      var node = d.createElement(name);
      for(var val in attr) { if(attr.hasOwnProperty(val)) node.setAttribute(val, attr[val]); }
      if(content) node.insertAdjacentHTML("afterbegin", content);
      append.appendChild(node);
      if(node.classList.contains("note-item-hidden")) node.classList.remove("note-item-hidden");
      return node;
    };

    /**
     * Генерация элементов
     */
    var noteBox = d.getElementById("notes") || create("div", { "id": "notes" }, d.body);
    var noteItem = create("div", {
        "class": "note-item",
        "data-show": "false",
        "role": "alert",
        "data-type": settings.type
      }, noteBox),
      noteItemText = create("div", { "class": "note-item-text" }, noteItem, settings.content),
      noteItemBtn = create("div", {
        "class": "note-item-btn",
        "type": "button",
        "aria-label": "Скрыть"
      }, noteItem);

    /**
     * Функция проверки видимости алерта во viewport
     * @returns {boolean}
     */
    var isVisible = function() {
      var coords = noteItem.getBoundingClientRect();
      return (
        coords.top >= 0 &&
        coords.left >= 0 &&
        coords.bottom <= (window.innerHeight || d.documentElement.clientHeight) && 
        coords.right <= (window.innerWidth || d.documentElement.clientWidth) 
      );
    };
    
    /**
     * Функция удаления алертов
     * @param {Object} [el] - удаляемый алерт
     */
    var remove = function(el) {
      el = el || noteItem;
      el.setAttribute("data-show","false");
      window.setTimeout(function() {
        el.remove();
      }, 250);
      if(settings.callback) settings.callback(); // callback
    };

    /**
     * Удаление алерта по клику на кнопку
     */
    noteItemBtn.addEventListener("click", function() { remove(); });

    /**
     * Визуальный вывод алерта
     */
    window.setTimeout(function() {
      noteItem.setAttribute("data-show","true");
    }, 250);


    /**
     * Проверка видимости алерта и очистка места при необходимости
     */
    if(!isVisible()) {console.log("!isVisible()");remove(noteBox.firstChild);}

    /**
     * Автоматическое удаление алерта спустя заданное время
     */
     console.log(settings.time);
    window.setTimeout(remove, settings.time * 1000);

  };

}(document);
var html_sA={
	'&':'&amp',
	'<':'&lt;',
	'>':'&gt;',
	'"':'&quot;',
	"'":'&#x27;',
	'/':'&#x2F;'
	}
	var er_sA=/[&<>"'\/]/g;
	var esci=function(str){
		return (''+str).replace(er_sA,function(m){return html_sA[m];});
		}
var g_data=function(d){
var c=new Date(d) || new Date();
var e_g=c.getFullYear();
var f_g=c.getMonth()+1;
var g_g=c.getDate();
var h_g=c.getHours();
var i_g=c.getMinutes();
return e_g+'-'+f_g+'-'+g_g+' '+h_g+':'+i_g;
}

//var fg='2020-11-25T14:11:43.281Z';
//alert(fg+'\n'+g_data(fg));

function mach_click(el){
var cid=el.getAttribute('data-cid');
if(!cid)return;
var d88={};
d88.id=cid;
vax("post", "/api/click_reklama", d88, on_click_reklama, on_click_reklama_err, null, false);	
}
function on_click_reklama(l){
console.log(l.info);	
}
function on_click_reklama_err(l){
	console.error(l);
	}
