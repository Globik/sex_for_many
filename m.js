/*var {spawn,exec}=require('child_process');
let du=["mail","-s","'some subject'","gru5@yandex.ru","<","/home/globik/sex_for_many/mail.html"];
exec('mail', function(er, s, si){
	console.log(er,s,si);
	
}) */
/*
var lis=spawn('mail', du);
lis.stderr.on('data',function(d){console.log(d.toString())})
lis.stdout.on('data',function(d){console.log(d.toString())})
console.log("aha");
lis.on('close',function(code){
console.log('child process code: ',code);
if(code==0){console.log("ok");}else{console.log("error");}	
})
console.log('fuck');
lis.on('exit',function(code){
console.log('child proces exit with code: ',code);	
//res();
})	
*/
/*
function mail_s(){
//return new Promise(function(res,rej){
//	console.log('kuku');
//mail -a  'Content-Type: text/html' -s "subject" gru5@yandex.ru < /home/globik/sex_for_many/mail.html
let du=["-a","Content-Type: text/html","-s","some subject","gru5@yandex.ru","<","/home/globik/sex_for_many/mail.html"];
//var ls=spawn('/usr/bin/mail', du);
console.log('aku');res("suka");
var ls=spawn('mail',["-s", "some subj", "gru5@yandex.ru", "<", "/home/globik/sex_for_many/mail.html"]);
ls.stderr.on('data',function(d){console.log(d.toString())})
ls.stdout.on('data',function(d){console.log(d.toString())})
ls.on('close',function(code){
	res();
console.log('child process code: ',code);
if(code==0){res("ok");}else{rej("error");}	
	
})
ls.on('exit',function(code){
console.log('child proces exit with code: ',code);	
//res();
})	
//})	
}

//mail_s().then(function(d){console.log('result: ',d)}).catch(function(er){console.log('ERROR: ',er);})
(async function(){
	try{await mail_s()}catch(e){console.log(e)}
	})()
*/

var nodemailer=require('nodemailer')
/*
let transporter=nodemailer.createTransport({
	sendmail:true,
	newline: 'unix',
	path:'/usr/sbin/sendmail'})
	
	transporter.sendMail({
		from: 'sender@example.com',
		to: 'gru5@yandex.ru',
		subject:'message',
		text: 'bla bla text'
	},(err,info)=>{
		console.log(info)
		console.log(err);
		})
		*/
		let transporter=nodemailer.createTransport(
		{
			//service:'gmail',
			//auth:{user:'',pass:''}
			sendmail:true,
   newline: 'unix',
				}
			) 
			
			transporter.sendMail({
		from: 'root@globikon.space',
		to: 'gru5@yandex.ru',
		subject:'message subject',
		text: 'bla bla show'
	},(err,info)=>{
		console.log(info)
		console.log(err);
		})
