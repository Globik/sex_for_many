const vert_menu=function(n){
return `<!-- vert_menu.js --><div id="left"><nav><div>${n.site}</div><ul>
<a href="/"><li>Стримы</a>
${n.user?`<a href="/webrtc/${n.user.id}"><li>Мой видеочат</a>`:''}
<a href="/obi"><li>Доска объявлений</a>
<a href="/blog"><li>Блог</a>
<a href="/tokens"><li>Купить токены</a>${n.user?`<span id="tokencntnav2">${n.user.items}</span>`:''}
${n.user?'<a href="/logout"><li>Выйти</a>':'<a href="/login"><li>Войти</a>'}
</ul></nav></div>`;	
}
module.exports={vert_menu}
