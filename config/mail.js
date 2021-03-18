const {site_name, site_domain, vk, telega, promo_token, one_token_btc} = require('./app.json');
const WELCOME = function(n){
	return{html:`<h1>Hey ${n.nick}</h1><p>Thanks for joining ${site_name}!<br><br>
		Now you'v got your own <a href="https://${site_domain}/webrtc/${n.id}">videochat-room</a><br><br>
		If you're a streamer and wanna get your payouts and donations in bitcoins please give to us in your videochat-room
		your bitcoin address.<br><br>Attention please: on ${site_name} the confirmation of the age is no need!
		 Cuz the payouts are only in bitcoins.<br><br>
		 If you're a viewer and wanna give tokens to streamers you can easy buy the tokens by bitcoins 
		 <a href="https://${site_domain}/tokens"> here</a>.<br><br>
		 We have <a href="https://${site_domain}/basa">FAQ</a> (Frequently Asked Questions).<br><br>
		 Folow us:<br><br>
		 <a href="${vk}">Vkontakte</a><br><br>
		 <a href="${telega}">telegram</a>
		 <br><br>Enjoy!<br><br></p>
		 <h1>Здравствуйте, ${n.nick},</h1><p>Благодарим за регистрацию в ${site_name}.<br><br> Теперь у вас есть своя личная 
		 <a href="https://${site_domain}/webrtc/${n.id}">видеочат-комната</a>.<br><br>
		 Если Вы стример и желаете получать не только выплаты, но и донаты в биткоинах, то
		 укажите, пожалуйста, в вашей чат-комнате ваш биткоин адрес.<br><br>
		 Обращаем Ваше внимание на то, что на нашем сайте подтверждения Вашего совершеннолетия не требуется. Так как выплаты
		  производятся только в биткоинах.<br><br>
		  Если Вы зритель и желаете давать стримерам токены, то Вы можете легко и просто купить токены 
		  <a href="https://${site_domain}/tokens"> здесь</a>.<br><br>
		  Ответы на разные вопросы у нас есть в разделе <a href="https://${site_domain}/basa">FAQ</a><br><br>
		  <a href="${vk}">Vkontakte</a><br><br>
		 <a href="${telega}">telegram</a><br><br>
		  Приятного времяпрепровождения на ${site_name}!</p>`,
		text:`Hey ${n.nick}, thanks for joining ${site_name}! Now you'v got your own videochat-room.`}
}

const AFTER_REGISTRATION = function(n){
	return {
ru: `<div id="afterRegistration"><h3>Поздравляем!</h3><p>У вас на счету ${promo_token} токенов! Это около ${(promo_token/2)*one_token_btc} биткоинов.</p></div>`,
en: `<div id="afterRegistration"><h3>Congratulations!</h3><p>You have on your account ${promo_token} tokens! It's about ${(promo_token/2)*one_token_btc} BTC.</p></div>`
		}
	}

module.exports={WELCOME, AFTER_REGISTRATION}
