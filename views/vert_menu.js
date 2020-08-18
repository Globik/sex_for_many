const vert_menu=function(n){
return `<!-- vert_menu.js --><div id="left"><nav><div>groom.ru</div><ul>
<a href="/"><li>Стримы</a>
${n.buser?`<a href="/webrtc/${n.buser.id}"><li>Мой видеочат</a>`:''}
<a href="/obi"><li>Доска объявлений</a>
<a href="/blog"><li>Блог</a>
<a href="/tokens"><li>Купить токены</a>
${n.buser?'<a href="/logout"><li>Выйти</a>':'<a href="/login"><li>Войти</a>'}
</ul></nav></div>`;	
}
module.exports={vert_menu}
