const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const crypto=require('crypto')
const axios=require('axios').default;
const fs=require('fs');
const util=require('util');
const path=require('path');
var {spawn}=require('child_process');
const readdir=util.promisify(fs.readdir);
const unlink=util.promisify(fs.unlink);
const mkdir=util.promisify(fs.mkdir);
const access=util.promisify(fs.access);
const rmdir=util.promisify(fs.rmdir);
const lstat=util.promisify(fs.lstat);
const {WELCOME}=require('../config/mail.js');
//const uuid=require('uuid/v4');
const GMAIL="globalikslivov@gmail.com";
const {is_reklama}=require('../config/app.json');
const onesignal_app_key = "NjQ5NWU0MjYtNDZjNS00MTA3LTkxODYtZWM5MzI1ODNiNDUy";
const onesignal_app_id = "ebc1d04b-30f9-4168-b7e7-f5b9c6780e40";
const walletValidator=require('wallet-address-validator');//0.2.4
const {RateLimiterMemory}=require('rate-limiter-flexible');
const gr = "\x1b[32m", rs = "\x1b[0m";

//var moment=require('moment');
//const email_enc=require('../libs/email_enc.js');
//const conf_pay=require('../config/pay.json');

const pub=new Router();

pub.get('/', reklama, async ctx=>{
//let bresult;
//let new_users;
let db=ctx.db;
let videoUsers;
//let videos;
try{
//let s='select us_id,nick,v,age,ava,isava from room left join profile on room.nick=profile.bname;';
//let d=`select buser.id, buser.bname, profile.age, profile.msg, 
//profile.ava,profile.bi,profile.city from buser left join profile on buser.bname=profile.bname order by id desc limit 5`;
/*let bus=await db.query(s);

if(bus.rows.length>0){
bresult=bus.rows;
}
let bus1=await db.query(d);
if(bus1.rows.length>0){
new_users=bus1.rows;
}
* 
* 
* us_id int not null,
nick varchar(16) unique not null references buser(bname),
src text, -- video src
p text, -- video poster
descr text, -- video stream description
crat TIMESTAMP  NOT NULL default now()::timestamp, -- created at
typ varchar(6) not null default 'activ', -- activ, fake,
v int no
*  */
let a=await db.query('select vroom.us_id,vroom.nick,vroom.src,vroom.p,vroom.crat,vroom.typ,vroom.v,buser.ava,buser.stat from vroom left join buser on vroom.nick=buser.bname',[]);
if(a.rows.length>0){
videoUsers=a.rows;	

}
/*
let bb=await db.query('select*from video limit 5');
if(bb.rows.length>0){
videos=bb.rows;	
}*/
}catch(e){console.log(e)}	
//ctx.session.dorthin=this.path;
//if(ctx.session.bmessage){m=ctx.session.bmessage;}
//ctx.body=await ctx.render('main_page',{lusers:bresult, new_users:new_users,videoUsers:videoUsers,videos:videos});
ctx.body=await ctx.render('main_page',{videoUsers:videoUsers});
//if(ctx.session.bmessage){delete ctx.session.bmessage}
});



/* onesignal.com */
pub.post("/api/onesignal_count", async ctx=>{
if(process.env.DEVELOPMENT  !="yes"){
	let {cnt, desc}=ctx.request.body;
		oni(desc," :"+cnt);
}
	ctx.body={info:"OK"}
})

/* end */

pub.get('/login', async ctx=>{
//let m=ctx.session.bmessage;
ctx.body=await ctx.render('login'/*,{errmsg:m}*/);
//delete ctx.session.bmessage;
});



pub.post('/login', (ctx,next)=>{
if(ctx.isAuthenticated()){
if(ctx.state.xhr){
ctx.throw(409, 'Already authenticated!')
}else{
return ctx.redirect('/')
}
}
return passport.authenticate('local', function (err,user,info,status){
if(ctx.state.xhr){
if(err){ctx.body={success:false,info:err.message}; ctx.throw(500,err.message);}
if(user===false){
ctx.body={success:false,info:info.message}
ctx.throw(401,info.message)
}else{
ctx.body={success:true, info:info.message, redirect:/*ctx.session.dorthin ||*/ '/'}
return ctx.login(user)
}
}else{
if(err){
ctx.session.bmessage={success:false,error:err.message}; return ctx.redirect('/login');
}
if(user===false){
ctx.session.bmessage={success:false, error:info.message};
ctx.redirect('/login')
}else{
ctx.redirect(/*ctx.session.dorthin ||*/ '/')
return ctx.login(user)
}
}
}
)(ctx,next)
})
pub.get('/logout', ctx=>{ctx.logout();ctx.redirect('/');});
pub.get('/signup', async ctx=>{

//if(ctx.isAuthenticated()) ctx.redirect(ctx.session.dorthin || '/');
let m=ctx.session.bmessage;
ctx.body=await ctx.render('signup',{errmsg: m});
delete ctx.session.bmessage;
})
async function oni(us,txt){
	if(process.env.DEVELOPMENT !="yes"){
let vurl = "https://onesignal.com/api/v1/notifications";
let data = {
		app_id:onesignal_app_id,
		contents:{en: us+" "+txt},
		included_segments:["Subscribed Users"]
		};
let headers ={"Authorization": "Basic "+onesignal_app_key};
try{
let r=await axios.post(vurl, data,{headers:headers});
console.log("r: ", r.data);
}catch(e){
console.log("err: ", e);
}	
}
}

pub.post('/signup', (ctx,next)=>{
	
if(ctx.isAuthenticated()){
if(ctx.state.xhr){
ctx.throw(409, 'Already authenticated!')
}else{
return ctx.redirect('/')
}}
let t=ctx.transporter;
return passport.authenticate('local-signup',async (err,user,info,status)=>{
console.log(err,user,info,status)

if(user){	
oni(info.username,"just signed up.");
t.sendMail({
		from: "",
		to: info.email,
		subject:'Welcome to the GLOBIKON!',
		html:WELCOME({nick: info.username,id:info.user_id}).html
	},(err,info)=>{
		console.log('info  mail: ',info)
		if(err){
		console.log(err);
	}
		}) 
}


if(ctx.state.xhr){
	console.log('XHR!!!!');
	//23505 name already in use
if(err){
ctx.throw(409,err.message)
}

if(!user){
ctx.body={success:false, message:info.message,code:info.code,bcode:info.bcode}
}else{
ctx.body={success:true, message:info.message,username:info.username,user_id:info.user_id,redirect:/*ctx.session.dorthin ||*/ '/'}
return ctx.login(user)
}
}else{
if(err){
ctx.session.bmessage={success:false,message:err.message}; return ctx.redirect('/signup');
}
if(!user){
ctx.session.bmessage={success:false,message:info.message,code:info.code,bcode:info.bcode}
ctx.redirect('/signup')
}else{	
ctx.session.bmessage={success:true, msg: info.message}
ctx.redirect('/')
return ctx.login(user)
}
}})(ctx,next)
})
const FORGET_PWD = function(n){ return`Forgot your password?\n
We've received a request to reset the password for this email address.\n
To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${n.page_url}/reset/${n.token}">${n.page_url}/reset/${n.token}</a>
This link takes you to a secure page where you can change your password.
If you don't want to reset your password, please ignore this message. Your password will not be reset.
If you received this email by mistake or believe it is spam, please...`;
} 
const FORGET_PWD_HTML = function(n){
	const TEXT2=`<html lang="en"><body>
Forgot your password?
<br><br>
We've received a request to reset the password for this email address.
<br><br>
To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${n.page_url}/reset/${n.token}">${n.page_url}/reset/${n.token}</a>
<br><br>
This link takes you to a secure page where you can change your password.
<br><br>
If you don't want to reset your password, please ignore this message. Your password will not be reset.</body></html>`;
	return TEXT2;
}
pub.get("/reset", async ctx=>{
	ctx.body=await ctx.render('reset',{});
})
pub.post("/reset", async ctx=>{
	let {email}=ctx.request.body;
	if(!email)ctx.throw(400, "no email provided!");
	console.log(email);
	let db = ctx.db;
	let r;
	try{
	r = await db.query(`select request_password_reset($1)`, [email]);
	//console.log("result: ", r.rows[0].request_password_reset);
	}catch(e){ctx.throw(400, e);}
let ms=`We have sent a password reset email to your email address: <a href="mailto:${email}">${email}</a><br><br> Please check your inbox to continue.`;
let m=`Мы послали письмо на ваш адрес: <a href="mailto:${email}">${email}</a><br>Если не пришло, пожалуйста, загляните в спам.`
	let t=ctx.transporter;
	t.sendMail({
		from: GMAIL,
		to: email,
		subject:'Смена пароля',
		text: FORGET_PWD({page_url: ctx.origin, token: r.rows[0].request_password_reset}),
		html: FORGET_PWD_HTML({page_url: ctx.origin, token: r.rows[0].request_password_reset})
	},(err,info)=>{
		console.log(info)
		console.log(err);
		}) 
	ctx.body= {info: m}
})

pub.get('/reset/:token', async ctx=>{
// 833410fe-281a-42c1-8544-b7e684ae8e6e
let r;
let db = ctx.db;
let err;
try{
let resu = await db.query(`select*from tokens where token=$1 and created_at > now() - interval '2 days'`, [ ctx.params.token ]);
console.log('resu: ', resu.rows[0]);
if(resu.rows.length > 0){r=resu.rows[0].token;}else{err = "Время ссылки вышло.";}
}catch(e){
console.log('error in reset params: ',e.name);
err  = "Страница не найдена.";
}	
ctx.body=await ctx.render('reset_token',{"reset-token":r, err: err})
})

pub.post("/reset/reset_token", async ctx=>{
let { email, password, token } = ctx.request.body;
if(!email || !password || !token) ctx.throw(400, "No data provided!")
let db = ctx.db;
try{
await db.query('select reset_password($1, $2, $3)', [ email, token, password ])	
}catch(e){
ctx.throw(400, e)	
}	
ctx.body = { info: "Пароль успешно сменен!" }
})

/*  VIDEOS */

pub.get('/videos',reklama, async ctx=>{
let db=ctx.db;
let result;
try{
let a=await db.query('select * from video limit 5');
if(a.rows.length>0)result=a.rows;	
}catch(e){console.log(e);}
if(process.env.DEVELOPMENT !="yes"){	
oni('videos',"here");
	}
ctx.body=await ctx.render('videos',{videos:result});
})
pub.post("/api/video_views", async ctx=>{
let {vid}=ctx.request.body;
if(!vid)ctx.throw(400,"no vid provided");
let db=ctx.db;
try{
await db.query('update video set v=v+1 where id=$1',[vid]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK"}	
})

pub.post("/api/get_more_videos", async ctx=>{
let {next}=ctx.request.body;
if(!next)ctx.throw(400,"no next");
let db=ctx.db;
let result;
let s=`select*from video where cr_at > $1 limit 5`;
try{
let a = await db.query(s,[next]);	
if(a.rows.length > 0){
result = a.rows;
}
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK",content:result}
});

pub.post("/api/video_deleteUs",auth, async ctx=>{
let {vid, src}=ctx.request.body;
if(!vid || !src)ctx.throw(400,"no vid or src provided");
let db=ctx.db;
try{
await db.query('delete from video where id=$1',[vid]);
await unlink(process.env.HOME+'/sex_for_many/public/vid/'+src);
}catch(e){ctx.throw(400,e);}
ctx.body={info: "OK, deleted!"}	
})

/* USERS */

pub.get("/home/users", async ctx=>{
let db=ctx.db;
let result;let err;
//let s='select buser.id, buser.bname, buser.crat, age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname limit 5';
let s='select id,ava,bname,crat,ll,items,email from buser order by crat';
try{
	result = await db.query(s);
	}catch(e){
	console.log(e);
	err=e;
	}
	ctx.body=await ctx.render("users",{result:result.rows,err:err});
})

pub.post("/api/fetch_all_suchen", async ctx=>{
let db=ctx.db;
let result;
let s='select buser.id, buser.bname, buser.crat, age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname limit 5';
try{
	result = await db.query(s);
	}catch(e){
	console.log(e);
	}
	ctx.body={result:result.rows};
})

pub.post("/api/get_more_users", async ctx=>{
let {next}=ctx.request.body;
console.log("next: ",next);
if(!next)ctx.throw(400,"No next");
let result;
let db=ctx.db;
let s=`select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname
 where buser.crat > $1 limit 5`;

try{
let a=await db.query(s,[next]);
if(a.rows.length>0){
result=a.rows;
}
}catch(e){
ctx.throw(400,e);	
}
ctx.body={content:result,info:"ok"}	
})

pub.post("/api/get_suchen", async ctx=>{
let {ab,bis,city,bi,keywort}=ctx.request.body;
let db=ctx.db;
let result;
let wab=(ab?ab:18);
let wbis=(bis?bis:100);
//select*from profile where msg like any(values('%g%'));
//select*from profile where msg like any(values('%msg%')) and age between 18 and 60 limit 5;
let s=`select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname
 where ${city?`city='${city}' and`:''}
 ${keywort?` msg like any(values('%${keywort}%')) and`:``} bi='${bi}' and age between ${wab} and ${wbis} limit 5;`;
try{
console.log('S_S: ', s);
result=await db.query(s,[]);
}catch(e){
ctx.throw(400, e);	
}
ctx.body={result:result.rows}	
})
/*
 select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname;
 select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser inner join profile on buser.bname=profile.bname;
 select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser right join profile on buser.bname=profile.bname;
  
  select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from profile left join buser on profile.bname=buser.bname;
 */ 
pub.post("/api/update_query", async ctx=>{
let {ab,bis,city,bi,keywort,next}=ctx.request.body;
if(!next){ctx.throw(400,"no next");}
let db=ctx.db;
let result;
let wab=(ab?ab:18);
let wbis=(bis?bis:100);
//select*from profile where msg like any(values('%msg%')) and age between 18 and 60 limit 5;
let s=`select buser.id,buser.bname,buser.crat,age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname
 where ${city?`city='${city}' and`:''}
 ${keywort?` msg like any(values('%${keywort}%')) and`:``} bi='${bi}' and age between ${wab} and ${wbis} and buser.crat > '${next}' limit 5;`;
try{
	console.log("S_S: ", s);
result=await db.query(s,[]);
}catch(e){
ctx.throw(400, e);	
}
ctx.body={result:result.rows}	
})

/* WEBRTC */

pub.get('/webrtc/:buser_id', reklama, async function(ctx){
	if(!Number(ctx.params.buser_id))return;
let us=ctx.state.user;
let db=ctx.db;
console.log("USER: ",us);
let a,result,videos,videos2;
let owner=false;
let sis;let descr;
if(ctx.state.is_test_btc){
sis=`select buser.bname ,buser.brole, buser.items,buser.proz, buser.id, buser.stat, buser.ava, cladr.padrtest, cladr.cadrtest, 
cladr.btc_all, cladr.inv from buser left join cladr on buser.bname=cladr.nick where buser.id=$1`;
}else{
sis=`select buser.bname , buser.brole,buser.items,buser.proz,buser.id,buser.stat, buser.ava, cladr.padr, cladr.cadr, 
cladr.btc_all, cladr.inv from buser left join cladr on buser.bname=cladr.nick where buser.id=$1`;
}
try{
result=await db.query(sis,[ctx.params.buser_id]);
a=result.rows[0];
if(a&&a.brole=='fake'){
videos2=await db.query('select*from vroom where nick=$1',[a.bname]);
videos=videos2.rows[0];
//descr=videos2.rows[0].descr;
console.log('videos: ',videos);
}else{
let de=await db.query('select descr from vroom where nick=$1',[a.bname]);
//if(de&&de.rows.length)descr=de.rows[0].descr;
}
}catch(e){
console.log('db error: ',e);
ctx.body=await ctx.render('room_err',{mess:"Нет такого пользователя."});
return;
}
if(result.rows.length==0){
ctx.body=await ctx.render('room_err',{mess:"No such user undefined"});
return;
}
if(us){
if(us.id==ctx.params.buser_id){owner=true;}
}

ctx.body= await ctx.render('chat_room',{model:a, owner:owner,videos:videos,descr:descr});
});
//pub.get('/webrtc/:buser_id', async function(ctx){});
//save btc address
//var prim="mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE";
const base_url_smart_tbtc="https://api.bitaps.com/btc/testnet/v1/create/payment/address/distribution";//for test btc smartcontract
const base_url_smart_btc='https://api.bitaps.com/btc/v1/create/payment/address/distribution'; //for real btc
const cb_link="https://frozen-atoll-47887.herokuapp.com/api/test_cb_smartc";


pub.post('/api/savebtcaddress', auth, async ctx=>{
	console.log('body: ',ctx.request.body);
	let {btc_client, is_testnet, username}=ctx.request.body;
	if(!btc_client || !username){ctx.throw(400, "No data provided! No username ,no btc client addr!");}
if(ctx.state.is_test_btc){
let vali=walletValidator.validate(btc_client,'bitcoin','testnet');
if(!vali){ctx.throw(400,"Неправильный тест биткоин адрес!");}
}else{
let valir=walletValidator.validate(btc_client,'bitcoin');
if(!valir){ctx.throw(400,"Неправильный биткоин адрес!");}	
}

let db=ctx.db;
let bod=undefined;
let data={};
if (ctx.state.is_test_btc){

data.forwarding_address_primary=ctx.state.test_btc_address;//must be mine
data.forwarding_address_secondary=btc_client;//must be client's one
data.forwarding_address_primary_share="10%";//ctx.state.btc_percent;
data.callback_link=ctx.origin+'/api/test_cb_smartc';//cb_link;

try{
bod=await axios.post(base_url_smart_tbtc,data)
console.log('bod: ', bod.data);

try{
let sql_create_smarti1=`insert into cladr(nick, cadrtest, padrtest, inv, pc) 
values($1,$2,$3,$4,$5) on conflict(nick) do update set cadrtest=$2,padrtest=$3,inv=$4,pc=$5`;

let si=await db.query(sql_create_smarti1,[
username, 
bod.data.forwarding_address_secondary, //cadrtest
bod.data.address, //padrtest
bod.data.invoice,
bod.data.payment_code
]);
console.log("db query: ", si);
 
}catch(e){console.log("db error: ", e);ctx.throw(400, e)}
}catch(e){ctx.throw(400, e.message);}

ctx.body={status:"ok", data:"tested"}
}else{
console.log("ctx.state.btc_address: ",ctx.state.btc_address);
console.log("btc_client: ",btc_client);

/*
data.forwarding_address_primary="1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy";//must be mine
data.forwarding_address_secondary="1PJsmJzFgkAVWwqPvcEHvYELcCcvsFgACo";//must be client's one
data.forwarding_address_primary_share="10%";//ctx.state.btc_percent;
*/




data.forwarding_address_primary=ctx.state.btc_address;//must be mine
data.forwarding_address_secondary=btc_client;//must be client's one
data.forwarding_address_primary_share=ctx.state.btc_percent;
data.callback_link=ctx.origin+'/api/test_cb_smartc';//cb_link;
console.log("cb_link: ",data.callback_link);
console.log("base_url_smart_btc: ",base_url_smart_btc);
console.log("ctx.state.btc_percent: ",ctx.state.btc_percent);

try{
bod = await axios.post(base_url_smart_btc, data)
console.log('bod: ', bod.data);

try{
let sql_create_smarti=`insert into cladr(nick, cadr, padr, inv, pc) values($1,$2,$3,$4,$5)
 on conflict(nick) do update set cadr=$2,padr=$3,inv=$4,pc=$5`;

let si1=await db.query(sql_create_smarti,[
username, 
bod.data.forwarding_address_secondary, //cadr
bod.data.address, 
bod.data.invoice,
bod.data.payment_code
]);
console.log("db query: ", si1);
 
}catch(e){console.log("db error: ", e);ctx.throw(400,"db error")}
}catch(e){console.log(e,'/|',e.message);
	ctx.throw(400, e.message);
	}

ctx.body={status:"ok", data:"real btc"}
	
}
});

/*
data.received_amount=200;
data.invoice="invQ67P7jvsWDNQ4EY2ZnA4qbB75UY7RWpcZrnycaTzfgfz2iYUiD";
data.code= "PMTvLqJhBnFJexwS1MqPPF6uJ8cLbYh87Re6Qz4wirnYiXrAojuBk";//payment code
data.amount=4;//payment amount
data.address="2NDbrgcoVvSXjQzk7ZUQCgx5QD5SXbw1y45"
insert into cladr(bname, cadrtest, padrtest, inv, pc) values('Globi','48586ff','adres344','34d','455fg65');
update cladr set btc_amt=40 where inv='34d';
*/   


pub.post("/api/test_cb_smartc", async ctx=>{
	console.log("it looks like callback came from bitaps\n",ctx.request.body);
	let {received_amount, invoice, code,amount,address}=ctx.request.body;
	let db=ctx.db;
	try{
	await db.query('update cladr set btc_amt=$1, btc_all=$2 where inv=$3',[amount,received_amount,invoice]);	
	}catch(e){console.log('db err: ',e);ctx.throw(404,e);}
	ctx.body=invoice;
})

// bankcard

pub.post("/api/set_bankcard", auth, async ctx=>{
let {bankcard, userid}=ctx.request.body;
if(!bankcard)ctx.throw(400,"No bankcard number!");
if(!userid)ctx.throw(400,"No userid!");
let db=ctx.db;
try{
await db.query('update buser set bcard=$1 where id=$2',[bankcard,userid]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK"};
})

/* SAVE VIDEO */


function s_video(user_name){
return new Promise(function(res,rej){

let sh=shortid.generate();
let du=["-f","concat","-safe","0","-i",process.env.HOME+"/sex_for_many/public/video/"+user_name+"/myfile.txt","-y","-c","copy",
process.env.HOME+"/sex_for_many/public/vid/"+user_name+"_"+sh+".webm"];

//let du=["-f","concat","-safe","0","-i",process.env.HOME+"/sex_for_many/public/video/"+user_name+"/myfile.txt","-y","-c","copy",
//process.env.HOME+"/sex_for_many/public/video/"+user_name+".webm"];

console.log('du: ',du);
const ls=spawn('ffmpeg',du);
ls.stderr.on('data',data=>{console.log(data.toString());})
ls.stdout.on('data',data=>{console.log(data.toString());})
ls.on('close',(code)=>{console.log('child process closed with code: ',code);
	if(code==0){
		//res(user_name+'_'+sh+'.webm')
		res(user_name+'.webm');
		}else{rej("error");}
	})
ls.on('exit',(code)=>{console.log('child process exit: ', code);})
})	
} 

function jopa(arr,us_name){
	return new Promise(function(res,rej){
var stream=fs.createWriteStream(process.env.HOME+"/sex_for_many/public/video/"+us_name+"/myfile.txt");
stream.once('open',(fd)=>{
	//stream.write("file '"+process.env.HOME+"/sex_for_many/public/video/"+us_name+"/"+us_name+"_1.webm'\n");
	arr.forEach(function(el,i){
	stream.write("file '"+process.env.HOME+"/sex_for_many/public"+el+"'\n")	
	})
	stream.on('error',function(e){rej(e)})
	stream.end();
	})
stream.on('close',function(){console.log("closeeeeeeeee");res(us_name)})
})
}

function roga(file,us_name){
return new Promise(function(res,rej){
	
})	
}

const removeDir=async(dir)=>{
try{
const files=await readdir(dir);
await Promise.all(files.map(async file=>{
try{
let p=path.join(dir,file);
let stat=await lstat(p);
if(stat.isDirectory()){
await removeDir(p);	
}else{
await unlink(p);	
}	
}catch(e){console.log(e)}	
}))
console.log('dir:',dir);
if(dir=="public/video/"){}else{
await rmdir(dir);
}
}catch(e){
console.log(e);	
}	
}

pub.post("/api/save_video", auth, bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
async ctx=>{
	let {v}=ctx.request.body.files;
	let {vn,room_id,room_name,is_active,is_first,is_record,recordArr}=ctx.request.body.fields;
	if(!v || !room_id || !room_name)ctx.throw(400, "No data");
	let db=ctx.db;
	var is_rec=false;
	//console.log("pathi: ",path);
	console.log('path: ',v.path);
	console.log('name: ', v.name);
	console.log('room_name: ', room_name);//for directory in video
	console.log('room_id: ',room_id);
	console.log('is_active: ',is_active);
	console.log('is_first: ',is_first);
	let s_s='./public/video/'+room_name+'/'+v.name;
	let v_src='/video/'+room_name+'/'+v.name;
	//try{await mkdir('./public/video/'+room_name);}catch(e){console.log('err in mkdir: ',e)}	
	try{
		let l=await access('./public/video/'+room_name, fs.constants.F_OK);
		console.log('if file exists?: ', l);
		}catch(e){
console.log('haha: ',e);

try{
await mkdir('./public/video/'+room_name);
}catch(e){console.log('err in mkdir: ',e)}	
		} 
try{
	console.log('v.path: ',v.path);
	console.log('s_s: ',s_s);
await insert_foto(v.path, s_s);

/*
if(is_first=="false" && is_active=="true"){
let popa=await jopa(['/video/'+room_name+'/'+v.name],room_name)
console.log('popa: ',popa);
let dad=await s_video(room_name);
console.log('dad: ',dad);
}*/

if(is_first=="true"){
//await db.query('insert into vroom(us_id,nick,vsrc) values($1,$2,$3) on conflict do nothing',[room_id,room_name, v_src]);
//await insert_foto(v.path, './public/video/'+room_name+'.webm');

}
console.log('IS ACTIVE??: ',is_active)
if(is_active=="false"){
//await db.query('delete from vroom where nick=$1',[room_name]);
console.log("REMOVING THE FILE DIRECTORY, ", room_name);
if(is_record=="true"){
	console.log("recordArr: ",recordArr);
	let li=JSON.parse(recordArr);
	console.log("li : ",li.d);
	is_rec=is_record;
	let jo=await jopa(li.d,room_name);
	console.log("JO: ",jo);
let da=await s_video(room_name);
console.log("DA: ",da)
await db.query('insert into video(nick,src,usid) values($1,$2,$3)',[room_name,da,room_id]);
}
await removeDir('./public/video/'+room_name);
}}catch(e){
		ctx.throw(400,e);
		}
ctx.body = { info: "ok, saved video", room_id: room_id, room_name: room_name, is_first: is_first, is_active, vsrc: v_src, is_record: is_rec }
})

pub.post("/api/del_arr_video", auth, async ctx=>{
let { arr, name } = ctx.request.body;
if( !arr || !name ){ ctx.throw(400, "no data") }
console.log('arr: ', arr);
console.log('name: ', name)
try{
await Promise.all( arr.map(async function(f){
console.log('f: ', f);
try{
await unlink( process.env.HOME + '/sex_for_many/public' + f)	
}catch(e){ ctx.throw(400, e) }	
}))
}catch(e){ ctx.throw(400, e) }
ctx.body = { info: "OK deleted" }	
})

/*
async function remove_files(name, eli){
try{
unlink(process.env.HOME+'/sex_for_many/public/video/'+name+'/'+eli)	
}catch(e){throw(e)}	
}
*/
function insert_foto(path, name){
return new Promise(function(res,rej){
var readstr=fs.createReadStream(path);
var writestr=fs.createWriteStream(name);
readstr.pipe(writestr);
readstr.on('open', function(){console.log('readstr is open');})
readstr.on('error',function(e){rej(e);})
readstr.on('close', function(){
console.log('readstr is close');
fs.unlink(path, function(e){
if(e){
console.log('readstr erri: ',e);
rej(e);
}
})
})
writestr.on('error',function(e){rej(e)})
writestr.on('open', function(){console.log('writestr is open');})
writestr.on('close',  function(){
console.log('writestr is close');
res()
})
})
}
			
/* YANDEX 
 * https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage/
 * https://yandex.ru/dev/money/doc/payment-buttons/reference/notifications-docpage/
 * Build https POST notifications(hooks):
 * https://money.yandex.ru/transfer/myservices/http-notification
 * */


pub.post('/api/cb/yam', async ctx=>{
console.log('ctx.request.body: ', ctx.request.body)
let { notification_type, operation_id, amount, currency, datetime, sender, codepro, label, sha1_hash, withdraw_amount, test_notification } = ctx.request.body;
let  s = `${notification_type}&${operation_id}&${amount}&${currency}&${datetime}&${sender}&${codepro}&${process.env.YANDEX_SEC}&${label}`;
let r=(label?label:'no label')
console.log('is label?: ',r)
console.log(s);
let db = ctx.db;
let sh = crypto.createHash('sha1')
let li = sh.update(s).digest('hex')
console.log('li: ',li)
console.log('sha:', sha1_hash)
if(li == sha1_hash){
console.log('HASH IS GUET')
//on_token_order(bname varchar(16),tok int, tsum numeric, wsum numeric, order_id int)
if(test_notification == 'true'){}else{
try{
	console.log('withdraw_amount: ',withdraw_amount)
await db.query('select on_token_order($1,$2,$3::numeric,$4::numeric,$5::bigint)',[label,100,amount,withdraw_amount, operation_id])	
}catch(e){console.log(e)}
}
}else{
console.log('HASH DOES NOT MATCH!!!')	
ctx.throw(400, "No gut");
}
ctx.body = "OK";	
})

/* 
 'p2p-incoming&test-notification&318.77&643&2020-06-22T16:25:03Z&41001000040&false&yandex_sec&'
 notification_type: 'p2p-incoming', //card-incoming => sender=''
  bill_id: '',
  amount: '198.37',
  datetime: '2020-06-22T15:16:11Z',
  codepro: 'false',
  sender: '41001000040',
  sha1_hash: '899d87fc049c3917c9cee37d9e4aebcbeb0c769f',
  test_notification: 'true',
  operation_label: '',
  operation_id: 'test-notification',
  currency: '643',
  label: ''

//production mode
* is label?:  Globi
card-incoming&653682507379002304&1.96&643&2020-09-17T18:28:27Z&&false&1nL*********JGSJDWMNFep4&Globi
====================
* ctx.request.body:  {
  notification_type: 'card-incoming',
  zip: '',
  bill_id: '',
  amount: '1.96',
  firstname: '',
  codepro: 'false',
  withdraw_amount: '2.00',
  city: '',
  unaccepted: 'false',
  label: 'Globi',
  building: '',
  lastname: '',
  datetime: '2020-09-18T01:19:59Z',
  suite: '',
  sender: '',
  phone: '',
  sha1_hash: '831c638cac1d53202061df87a76f1d6df6efa16c',
  street: '',
  flat: '',
  fathersname: '',
  operation_label: '26f61ed7-0011-5000-a000-1a9387be4ed9',
  operation_id: '653707199659002312',
  currency: '643',
  email: ''
}
is label?:  Globi
card-incoming&653707199659002312&1.96&643&2020-09-18T01:19:59Z&&false&1n***************NFep4&Globi


 */ 
 
pub.get('/tokens', async ctx=>{

ctx.body = await ctx.render('token',{})
})
// https://developer.bitaps.com/forwarding
pub.post("/api/get_bitaps_invoice_2", auth, async ctx=>{
	let { user_id, bname, btc} = ctx.request.body;
	if(!user_id || !bname || !btc) ctx.throw(400, "no data provided!");
	if(!ctx.state.test_btc_address || !ctx.state.btc_address) ctx.throw(400, "No test btc address or btc address provided!");
	console.log("ctx.request.body: ", ctx.request.body);
	const testnet_url = "https://api.bitaps.com/btc/testnet/v1/create/payment/address";
	const mainnet_url = "https://api.bitaps.com/btc/v1/create/payment/address";
	let forwarding_address = (ctx.state.is_test_btc ? ctx.state.test_btc_address : ctx.state.btc_address);//must be mine
	console.log("forwarding_address: ", forwarding_address);
	let callback_link = ctx.origin + '/api/bitaps_callback/' + user_id;
	let confirmations = 1;
	let db = ctx.db;
	let body, result;
	let data = {};
	data.forwarding_address = forwarding_address;
	data.callback_link = callback_link;
	data.confirmations = confirmations;
	
	try{
		//get_address(usid int, st int, zeit text)
		let r = await db.query(`select * from get_address($1, 0, '150')`, [ user_id ]);
		if(r.rows.length) result = r.rows[0].adr
		}catch(e){ ctx.throw(400, e); }
	
	if(!result){
	try{
		body = await axios.post((ctx.state.is_test_btc ? testnet_url : mainnet_url), data);
		console.log('body.data: ', body.data);
		var {invoice, payment_code, address} = body.data;
		if(!invoice || !payment_code || !address) ctx.throw(400, "No invoice provided!");
		}catch(e){ctx.throw(400,e);}
//insert into bitaps_tmp(bname,us_id,inv,pc,adr) values('Globi',1,'inv','3344fr5','qwwe44');--name,id,invoice,payment code, address
try{
let a = await db.query(`insert into bitaps_tmp(bname, us_id, inv, pc, adr) values($1, $2, $3, $4, $5) returning adr`,
																				[ bname, user_id, invoice, payment_code, address ])
if(a.rows.length) result = a.rows[0].adr;																				
}catch(e){ ctx.throw(400, e); }
}
ctx.body = { info: "OK", address: result, bname, btc };
})

/*
 body.data:  { 
  invoice: 'invPDHmi4Jp64PdDcjiWCGAN9JYWBbJnWw5zhpjmHFUo4hKMiVyVA',
  payment_code: 'PMTvzmoLU5zPnE1LnFQKnMe9nnk9ZTFvRfqbHsxJgtyJmyBZqa6BK',
  address: '2MwHCRBLcohdNR7Xxw8Qgws6mEMi8K9oYyF',
  domain: '',
  domain_hash: 'b472a266d0bd89c13706a4132ccfb16f7c3b9fcb',
  confirmations: 3,
  callback_link: 'http://:3000/api/bitaps_callback',
  forwarding_address: 'mqwRsYbYjU19m3SP89dREEBkoNUAetf1FK',
  currency: 'tBTC' 
  }

 */ 
pub.post('/api/bitaps_callback/:userid', async ctx=>{
let {invoice, code, address, amount} = ctx.request.body;
console.log('callback detected -> ctx.request.body: ', ctx.request.body);
if(!invoice || !code || !address)ctx.throw(404,"no data");
let us_id = Number(ctx.params.userid);
console.log('us_id: ', us_id);
let db = ctx.db;
try{
await db.query('select bitaps_cb($1,$2,$3)', [ us_id, code, Number(amount) ])	
	}catch(e){
		console.log('error in db callback: ', e);
		}
ctx.body = invoice;	
});


/* USERPAY */

pub.get("/userpay/:name",authed,async ctx=>{
	console.log('ctx.params: ', ctx.params);
	let db=ctx.db;
	let payout;
	try{
		let a=await db.query('select*from token_payout where tom=$1', [ctx.params.name]);
		//console.log('a.rows: ',a.rows);
		if(a.rows.length){payout=a.rows;}else{
ctx.body=await ctx.render('room_err',
{mess:"Или юзера такого нет или выплат еще не производили. Потерпи, когда 1000 рублей наберется!! Cовет: заглядывайте в спам в своем почтовом ящике"});
		return;
		}
		}catch(e){console.log(e);}
	ctx.body=await ctx.render('userpay',{payout:payout});
})

/* PROFILE */

pub.post("/api/get_p", async ctx=>{
let {name}=ctx.request.body;
console.log("NAME: ",name);

let db=ctx.db;
if(!name)ctx.throw(400,"no name");
let a;
let obj={};
obj.info="not";
try{
a=await db.query('select*from profile where bname=$1',[name]);	
//console.log(a.rows);
if(a.rows && a.rows.length > 0){
obj.info="ok";
obj.params=a.rows[0];	
}
}catch(e){console.log(e);}
ctx.body=obj;	
})

pub.post("/api/set_views", async ctx=>{
	let {name}=ctx.request.body;
	if(!name)ctx.throw(400,"no name");
let db=ctx.db;
try{
	await db.query("update profile set vs=vs+1 where bname=$1", [name]);
	}catch(e){
	ctx.throw(400, e);
	}	
ctx.body={info:"ok, setted views"};
})

/*

pub.get('/home/profile', authed, async ctx=>{
let db=ctx.db;
let err;
let a;
try{
let result=await db.query('select bname, age, isava, vs from profile');
if(result.rows.length)a=result.rows;
console.log('a: ',a);	
}catch(e){err=e;}
ctx.body=await ctx.render('profiles',{err:err,result:a});	
})
*/ 

pub.get('/home/profile/:profile_name', authed, async ctx=>{
let db=ctx.db;
let us=ctx.state.user;
let err;
let a;
let owner=false;
try{
	let result=await db.query("select*from profile where bname=$1",[ctx.params.profile_name]);
	a=result.rows[0];
}catch(e){
	err=e;
}
if(us){
if(us.bname==ctx.params.profile_name){owner=true;}
}
ctx.body=await ctx.render('profile',{err:err, result:a,owner:owner});	
})

pub.post("/api/save_profile", auth,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
 async ctx=>{
	// console.log(ctx.request.body.fields)
let {txt_msg, age, photo, fname, gay, city} = ctx.request.body.fields;
console.log(txt_msg, age, photo,fname, gay, city);
let {zfile}=ctx.request.body.files;
console.log('zfile: ',zfile.path,zfile.name)
let s_name;
//let s_name='/profile/'+zfile.name;
let db=ctx.db;
let isava=(photo?1:0);
let s=`insert into profile(bname,age,msg,ava,isava,city,bi) values($1,$2,$3,$4,$5,$6,$7) 
on conflict(bname) do update set age=$2,msg=$3,ava=$4,isava=$5,city=$6,bi=$7`
try{
if(zfile && zfile.name){
 s_name='/profile/'+zfile.name;
//let result=await db.query();
try{
let result=await db.query('select ava from profile where bname=$1',[fname] );

console.log('result:',result.rows);
if(result.rows && result.rows.length==1){
try{
await unlink('./public'+result.rows[0].ava)
}catch(e){}
}
}catch(e){
console.log(e);	
}
await insert_foto(zfile.path,'./public/'+ s_name)
}else{
try{
await unlink(zfile.path);	
}catch(e){}	
}
await db.query(s,[fname,age,txt_msg,s_name,isava,city,gay]);	
}catch(e){ctx.throw(400,e);}

ctx.body={info:"Профиль сохранен!"};	
})

pub.post("/api/save_ava",auth,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
 async ctx=>{
let {fname}=ctx.request.body.fields;
if(!fname)ctx.throw(400,"no data");
let {zfile}=ctx.request.body.files;
let s_name;
let db=ctx.db;
let s=`update buser set ava=$1 where bname=$2`;
try{
if(zfile && zfile.name){
 s_name='/profile/'+zfile.name;
//let result=await db.query();
try{
let result=await db.query('select ava from buser where bname=$1',[fname] );

console.log('result:',result.rows);
if(result.rows && result.rows.length==1){
try{
await unlink('./public'+result.rows[0].ava)
}catch(e){}
}
}catch(e){
console.log(e);	
}
await insert_foto(zfile.path,'./public/'+ s_name)
}else{
try{
await unlink(zfile.path);	
}catch(e){}	
}
await db.query(s, [ s_name, fname ]);	
}catch(e){ctx.throw(400, e);}
ctx.body={info:"OK - аватарка сохранена!",path:s_name}
})

pub.post("/api/foto_error", async ctx=>{
let {avid}=ctx.request.body;
	if(!avid)ctx.throw(400,"no avid");
	let db=ctx.db;
	try{
		await db.query("update buser set ava='' where id=$1",[avid]); 
		}catch(e){ctx.throw(400,e);}
ctx.body={info: "ok, foto deleted"}	
})

pub.post("/api/save_status", auth,async ctx=>{
let {status,bname}=ctx.request.body;
if(!status || !bname)ctx.throw(400,"no data");
let db=ctx.db;
try{
await db.query('update buser set stat=$1 where bname=$2',[status, bname]);	
}catch(e){ctx.throw(400, e);}
ctx.body={info:"OK - статус сохранен!"}	
})

pub.post("/api/del_ava", auth, async ctx=>{
let {fname,src}=ctx.request.body;
if(!fname)ctx.throw(400, "Нет имени");
console.log(fname,src);
let db=ctx.db;
try{
await unlink('./public'+src)	
}catch(e){conssole.log(e);}
try{
await db.query("update profile set ava='',isava=0 where bname=$1",[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"Фото удалено!"};	
})
// obi
pub.get('/obi', reklama, async ctx=>{
	let db=ctx.db;
	let res;
	try{
	var res2=await db.query('select*from obi order by id desc');	
	res=res2.rows;
	}catch(e){console.log(e);}
oni('obi ',"here.");
ctx.body=await ctx.render('obi',{obis:res});	
})

pub.post("/api/save_obi", wasi, async ctx=>{
let {nick,msg, zakrep}=ctx.request.body;
if(!nick && !msg)ctx.throw(400,"Нет необходимых данных");
let db=ctx.db;
let a;
let d=0;
if(zakrep)d=6;
try{
a=await db.query('insert into obi(bnick,msg, isg) values($1,$2,$3) returning id',[nick,msg,d]);
console.log('a: ', a.rows);	
oni(nick,"just saved advert");

}catch(e){ctx.throw(400,e);}
ctx.body={info:"ok", nick: nick, msg: msg,id:a.rows[0].id};	
})

const rateLimiter=new RateLimiterMemory({points:1,duration:60})

async function wasi(ctx, next){
try{
await rateLimiter.consume(ctx.ip)
console.log('ctx.ip: ', ctx.ip);
return next();	
}catch(e){
ctx.throw(429,'Погоди немножко.');	
}	
}

pub.post("/api/cust_del_obi", async ctx=>{
	let {id}=ctx.request.body;
if(!id)ctx.throw(400, "no id");
let db=ctx.db;
try{
	await db.query('delete from obi where id=$1', [id]);
	}catch(err){ctx.throw(400, err);}	
	ctx.body={info:"OK deleted", id: id};
})

pub.post("/api/fetch_obi_content", async ctx=>{
let db=ctx.db;
let r;
try{
r=await db.query('select*from obi order by id desc limit 1');
r=r.rows[0];	
}catch(e){
ctx.throw(400, e);	
}
ctx.body={info:"OK", r: r}
})

/* ADVERTISE */
pub.get("/home/advertise", async ctx=>{
	let db=ctx.db;
	let art;
	try{let a=await db.query("select*from ads where sub='ads'");
		if(a.rows && a.rows.length){art=a.rows[0];}
		}catch(e){console.log(e);}
		oni("advertise","here");
	ctx.body=await ctx.render('advertise',{art:art});
	})

/* BASA знаний */
pub.get("/basa", async ctx=>{
	console.log('here basa');
	let db = ctx.db;
	let art;
	try{let a = await db.query("select*from ads where sub='basa'");
		if(a.rows && a.rows.length){art = a.rows[0];console.log('art: ', art)}
		}catch(e){console.log(e);}
oni('basa ',"here.");
	ctx.body=await ctx.render('basa',{art:art});
	})

/* PRIVACY */
pub.get("/home/privacy", async ctx=>{
let db=ctx.db;
let a;
try{
	let b=await db.query("select*from ads where sub='privacy'");
	if(b.rows && b.rows.length){a=b.rows[0];}
	}catch(e){
	console.log(e);
	}	
oni('privacy ',"just here.");
	ctx.body=await ctx.render('privacy',{result: a});
})


/* BLOG */

pub.get("/blog", reklama, pagination, async ctx=>{
	let db=ctx.db;
	let posts;
	try{
		let a=await db.query('select * from blog limit 5');
		if(a.rows.length)posts=a.rows
		}catch(e){console.log(e);}
		
		console.log("B: ", ctx.locals);
	
oni('blog ',"just here.");
	
	ctx.body=await ctx.render('blogs',{locals:ctx.locals,posts:posts});
	})
	
	pub.get("/blog/:page", reklama, pagination, async ctx=>{
		console.log("ctx params: ", ctx.params);
		let {page}=ctx.params;
		page=Number(page);
		if(page<=0 || page > ctx.locals.total_pages){
			ctx.redirect("/home/blog");
			//return;
			}
			if(!page)ctx.redirect("/home/blog");
			let posts;
			let db=ctx.db;
			try{
				let a=await db.query('select*from blog limit 5 offset 5*$1',[page-1]);
				if(a.rows&& a.rows.length)posts=a.rows;
				}catch(e){console.log(e);}
		ctx.body=await ctx.render('blogs',{locals:ctx.locals,posts:posts})
		})

pub.get("/ru/:slug", reklama, async ctx=>{
	let db=ctx.db;
	let result;
	try{
		 result=await db.query('select*from blog where slug=$1', [ctx.params.slug]);
		}catch(e){console.log(e);}
oni('an article '+ctx.params.slug," just viewed.");

		ctx.body=await ctx.render('article_v',{result:result.rows[0]})
	})

module.exports=pub;

function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated()){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated()){
return next()
}else{ ctx.redirect('/');}}

const limit=5;
async function pagination(ctx, next){
	let db=ctx.db;
	var ab=[];
	var deg=2;
	ctx.locals={};
	var map=new Map();
	var page=Number(ctx.params.page) || 1;
	 
	var num=page*5;
	
	try{
		let a=await db.query('select from blog');
		if(a.rows.length>0){
			console.log("A: ", a.rows.length);
		var total_pages=Math.ceil(a.rows.length/limit);
			console.log("total_pages: ", total_pages);
			for(var i=0;i<total_pages;i++){
				ab.push(i+1);
				}
				ab.forEach(function(el,i){
					
					if(total_pages >=15){
						if(i<=5){
							map.set(i,ab.slice(0,5));
							console.log('here map 1');
							}
							if(i>5 && i <(total_pages - 5)){
								map.set(i,ab.slice((i-1)-deg,i+deg));
								console.log('here map 2');
								}
								if(i>=total_pages - 5){
									map.set(i,ab.slice(total_pages - 5, total_pages));
									console.log('here map 3');
									}
						}else{
							map.set(i,ab.slice(0, total_pages));
							console.log('here map 4', i, ab);
							}
					})
					
				console.log("ab: ", ab);
			console.log("map: ", map)
			ctx.locals.total_articles=a.rows.length;
			ctx.locals.total_pages=total_pages;
			ctx.locals.page=page;
			ctx.locals.rang_page=map;
			if(num<a.rows.length){ctx.locals.next=true;}
			if(num>5){ctx.locals.prev=true}
			}
		}catch(e){console.log(e);}
		return next();
}

async function reklama(ctx,next){ 
if(!is_reklama){return next();}
	let db=ctx.db;
try{
var ban=await db.query("select*from reklama where statu=2");
ctx.state.banner=ban.rows;	
}catch(e){
	console.log("banner error: ", e);
	}
return next();
}
