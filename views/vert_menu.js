const vert_menu=function(n){
return `<!-- vert_menu.js --><div id="left"><nav><div>${n.site}</div><ul>
<a href="/"><li>${n.user?n.user.lng=='ru'?'Стримы':'Streams':'Стримы'}</a>
${n.user?`<a href="/webrtc/${n.user.id}"><li>${n.user.lng=='ru'?'Мой видеочат':'My videochat room'}</a>`:''}
${n.user?`<a href="/home/profile/{n.user.bname}"><li>${n.user.lng=='ru'?'Личный кабинет':'Dashboard'}</a>`:''}
<a href="/obi"><li>${n.user?n.user.lng=='ru'?'Доска объявлений':'Message board':'Доска объявлений'}</a>
<a href="/blog"><li>${n.user?n.user.lng=='ru'?'Блог':'Blog':'Блог'}</a>
${n.user?`<a href="/tokens"><li>${n.user.lng=='ru'?'Купить токены':'Purchase tokens'}</a><span id="tokencntnav2">${n.user.items}</span>`:''}
${n.user?`<a href="/logout"><li>${n.user.lng=='ru'?'Выйти':'Sign out'}</a>`:'<a href="/login"><li>Войти | Log in</a>'}
</ul></nav></div>`;	
}
module.exports={vert_menu}
