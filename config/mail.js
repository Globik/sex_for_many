const WELCOME=function(n){
	return{html:`<h1>Hey ${n.nick}</h1><p>Thanks for joining Globikon!<br><br>
		Now you'v got your own <a href="https://globikon.space/webrtc/${n.id}">videochat-room</a><br><br>
		If you're a streamer and wanna get your payouts and donations in bitcoins please give to us in your videochat-room
		your bitcoin address.<br><br>Attention please: on Globikon the confirmation of the age is no need!
		 Cuz the payouts are only in bitcoins.<br><br>
		 If you're a viewer and wanna give tokens to streamers you can easy buy the tokens by bitcoins 
		 <a href="https://globikon.space/tokens"> here</a>.<br><br>
		 We have <a href="https://globikon.space/basa">FAQ</a> (Frequently Asked Questions).<br><br>Enjoy!<br><br></p>
		 <h1>Здравствуйте, ${n.nick},</h1><p>Благодарим за регистрацию в Globikon.<br><br> Теперь у вас есть своя личная 
		 <a href="https://globikon.space/webrtc/${n.id}">видеочат-комната</a>.<br><br>
		 Если Вы стример и желаете получать не только выплаты, но и донаты в биткоинах, то
		 укажите, пожалуйста, в вашей чат-комнате ваш биткоин адрес.<br><br>
		 Обращаем Ваше внимание на то, что на нашем сайте подтверждения Вашего совершеннолетия не требуется. Так как выплаты
		  производятся только в биткоинах.<br><br>
		  Если Вы зритель и желаете давать стримерам токены, то Вы можете легко и просто купить токены 
		  <a href="https://globikon.space/tokens"> здесь</a>.<br><br>
		  Ответы на разные вопросы у нас есть в разделе <a href="https://globikon.space/basa">FAQ</a><br><br>
		  Приятного времяпрепровождения на Globikon!</p>`,
		text:`Hey ${n.nick}, thanks for joining Globikon! Now you'v got your own videochat-room.`}
}
//console.log("FUCK: ", WELCOME({nick:"Globi",id:1}).html);
module.exports={WELCOME}
