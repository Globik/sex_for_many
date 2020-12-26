const vert_menu=function(n){
return `<!-- vert_menu.js --><div id="left"><nav><div>${n.site}</div><ul>
<a href="/"><li>Стримы Streams</a>
${n.user?`<a href="/webrtc/${n.user.id}"><li>Мой видеочат My videochat</a>`:''}
<a href="/obi"><li>Доска объявлений Message board</a>
<a href="/blog"><li>Блог Blog</a>
${n.user?`<a href="/tokens"><li>Купить токены Purchase tokens</a><span id="tokencntnav2">${n.user.items}</span>`:''}
${n.user?'<a href="/logout"><li>Выйти Logout</a>':'<a href="/login"><li>Войти Login</a>'}
</ul></nav></div>`;	
}
module.exports={vert_menu}
