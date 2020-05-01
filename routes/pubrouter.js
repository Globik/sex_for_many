const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const uuid=require('uuid/v4');

const reqw=require('request-promise-native');
const onesignal_app_key = "MGFmMmZlOTgtOTAyMi00NWE2LThhMTYtNWMwYmNlYTRlYzUw";
const onesignal_app_id = "b989ab63-af54-4afc-b68d-0ab78133540c";
const walletValidator=require('wallet-address-validator');//0.2.4
const {RateLimiterMemory}=require('rate-limiter-flexible');
const gr = "\x1b[32m", rs = "\x1b[0m";

//var moment=require('moment');
//const {readf}=require('../libs/await-fs.js');//cofs
//const fs=require('fs');
//const email_enc=require('../libs/email_enc.js');
//const {Encoder, Levels, Types}=require('../libs/qr-node.js');// any need?? i think no need . must be client side

//const conf_pay=require('../config/pay.json');

const pub=new Router();

pub.get('/', reklama, async ctx=>{
let bresult;
let new_users;
let db=ctx.db;

try{
let s='select us_id,nick,v,age,ava,isava from room left join profile on room.nick=profile.bname;';
let d='select buser.id, buser.bname, profile.age, profile.msg, profile.ava from buser left join profile on buser.bname=profile.bname order by id desc limit 20';
let bus=await db.query(s);

if(bus.rows.length>0){
bresult=bus.rows;
}
let bus1=await db.query(d);
if(bus1.rows.length>0){
new_users=bus1.rows;
}
}catch(e){console.log(e)}	
//ctx.session.dorthin=this.path;
//if(ctx.session.bmessage){m=ctx.session.bmessage;}
ctx.body=await ctx.render('main_page',{lusers:bresult, new_users:new_users});
//if(ctx.session.bmessage){delete ctx.session.bmessage}
});

/* onesignal.com */
pub.post("/api/onesignal_count", async ctx=>{
	if(process.env.DEVELOPMENT  !="yes"){
	let {cnt, desc}=ctx.request.body;
	let opt={
		app_id:onesignal_app_id,
		contents:{en: desc+" :"+cnt},
		included_segments:["Subscribed Users"]
		};
	let mops={
		url: "https://onesignal.com/api/v1/notifications",
		 method:"post", 
		 headers:{"Authorization": "Basic "+onesignal_app_key},
		 json:true,
		 body:opt
		 };
		// console.log(onesignal_app_key);
	try{
		let r=await reqw(mops);
		console.log("r: ", r);
		}catch(e){
			console.log("err: ", e.name);
			ctx.throw(400,e);
			}
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

pub.post('/signup', (ctx,next)=>{
if(ctx.isAuthenticated()){
if(ctx.state.xhr){
ctx.throw(409, 'Already authenticated!')
}else{
return ctx.redirect('/')
}}
return passport.authenticate('local-signup',async (err,user,info,status)=>{
console.log(err,user,info,status)

if(user){
if(process.env.DEVELOPMENT !="yes"){	
let opt={
		app_id:onesignal_app_id,
		contents:{en: info.username+" just signed up."},
		included_segments:["Subscribed Users"]
		};
	let mops={
		url: "https://onesignal.com/api/v1/notifications",
		 method:"post", 
		 headers:{"Authorization": "Basic "+onesignal_app_key},
		 json:true,
		 body:opt
		 };

	try{
		let r=await reqw(mops);
		console.log("r: ", r);
		}catch(e){
			console.log("err: ", e.name);
			//ctx.throw(400,e);
			}	
	}
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
ctx.body={success:true, message:info.message,redirect:/*ctx.session.dorthin ||*/ '/'}
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

/* USERS */

pub.get("/home/users", async ctx=>{
let db=ctx.db;
let result;
let s='select buser.id, buser.bname, buser.crat, age,ava,msg,bi,city from buser left join profile on buser.bname=profile.bname limit 5';
try{
	result = await db.query(s);
	}catch(e){
	console.log(e);
	}
	ctx.body=await ctx.render("users",{result:result.rows});
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

/* WEBRTC */

pub.get('/webrtc/:buser_id', reklama, async function(ctx){
	if(!Number(ctx.params.buser_id))return;
let us=ctx.state.user;
let db=ctx.db;
console.log("USER: ",us);
let a,result;
let owner=false;
let sis;
if(ctx.state.is_test_btc){
sis=`select buser.bname , buser.id, cladr.padrtest, cladr.cadrtest, cladr.btc_all, cladr.inv from buser left join cladr 
on buser.bname=cladr.nick where buser.id=$1`;
}else{
sis=`select buser.bname , buser.id, cladr.padr, cladr.cadr, cladr.btc_all, cladr.inv from buser left join cladr 
on buser.bname=cladr.nick where buser.id=$1`;
}
try{
result=await db.query(sis,[ctx.params.buser_id]);
a=result.rows[0];
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
ctx.body= await ctx.render('chat_room',{model:a, owner:owner});
});
//pub.get('/webrtc/:buser_id', async function(ctx){});
//save btc address
//var prim="mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE";
const base_url_smart_tbtc="https://api.bitaps.com/btc/testnet/v1/create/payment/address/distribution";//for test btc smartcontract
const base_url_smart_btc='https://api.bitaps.com/btc/v1/create/payment/address/distribution'; //for real btc
const cb_link="https://frozen-atoll-47887.herokuapp.com/api/test_cb_smartc";


pub.post('/api/savebtcaddress', async ctx=>{
	console.log('body: ',ctx.request.body);
	let {btc_client, is_testnet, username}=ctx.request.body;
	if(!btc_client || !username){ctx.throw(400, "No data provided! No username ,no btc client addr!");}
if(ctx.state.is_test_btc){
let vali=walletValidator.validate(btc_client,'bitcoin','testnet');
if(!vali){ctx.throw(400,"Неправилььный тест биткоин адрес!");}
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

let mops={url: base_url_smart_tbtc, method:"post", json:true,body:data};
try{
bod=await reqw(mops);
console.log('bod: ', bod);

try{
let sql_create_smarti1=`insert into cladr(nick, cadrtest, padrtest, inv, pc) 
values($1,$2,$3,$4,$5) on conflict(nick) do update set cadrtest=$2,padrtest=$3,inv=$4,pc=$5`;

let si=await db.query(sql_create_smarti1,[
username, 
bod.forwarding_address_secondary, //cadrtest
bod.address, //padrtest
bod.invoice,
bod.payment_code
]);
console.log("db query: ", si);
 
}catch(e){console.log("db error: ", e);ctx.throw(400,"db error")}
}catch(e){ctx.throw(400, e.message);}

ctx.body={status:"ok", data:"tested", bod:bod}
}else{

data.forwarding_address_primary=ctx.state.btc_address;//must be mine
data.forwarding_address_secondary=btc_client;//must be client's one
data.forwarding_address_primary_share=ctx.state.btc_percent;
data.callback_link=ctx.origin+'/api/test_cb_smartc';//cb_link;

let mops={url: base_url_smart_btc, method:"post", json:true,body:data};
try{
bod=await reqw(mops);
console.log('bod: ', bod);

try{
let sql_create_smarti=`insert into cladr(nick, cadr, padr, inv, pc) values($1,$2,$3,$4,$5)
 on conflict(nick) do update set cadr=$2,padr=$3,inv=$4,pc=$5`;

let si1=await db.query(sql_create_smarti,[
username, 
bod.forwarding_address_secondary, //cadr
bod.address, 
bod.invoice,
bod.payment_code
]);
console.log("db query: ", si1);
 
}catch(e){console.log("db error: ", e);ctx.throw(400,"db error")}
}catch(e){ctx.throw(400, e.message);}

ctx.body={status:"ok", data:"real btc", bod:bod}
	
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
	ctx.body=invoice;//{info:"ok",invoice:invoice}
})
/* profile */

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

pub.post("/api/save_profile", auth, async ctx=>{
let {txt_msg, age, photo, fname, gay, city} = ctx.request.body;
let db=ctx.db;
let isava=(photo?1:0);
let s='insert into profile(bname,age,msg,ava,isava,city,bi) values($1,$2,$3,$4,$5,$6,$7) on conflict(bname) do update set age=$2,msg=$3,ava=$4,isava=$5,city=$6,bi=$7'
try{
await db.query(s,[fname,age,txt_msg,photo,isava,city,gay]);	
}catch(e){ctx.throw(400,e);}

ctx.body={info:"Профиль сохранен!"};	
})
pub.post("/api/del_ava", auth, async ctx=>{
let {fname}=ctx.request.body;
if(!fname)ctx.throw(400, "Нет имени");
let db=ctx.db;
try{
await db.query("update profile set ava='',isava=0 where bname=$1",[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"Фото удалено!"};	
})
// obi
pub.get('/home/obi', reklama, async ctx=>{
	let db=ctx.db;
	let res;
	try{
	var res2=await db.query('select*from obi');	
	//if(res2.rows&&res2.rows.length>0)res=res2.rows;
	//console.log(res2.rows);
	res=res2.rows;
	}catch(e){console.log(e);}
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

if(process.env.DEVELOPMENT !="yes"){
let opt={
		app_id:onesignal_app_id,
		contents:{en: nick+" saved obiavlenije."},
		included_segments:["Subscribed Users"]
		};
	let mops={
		url: "https://onesignal.com/api/v1/notifications",
		 method:"post", 
		 headers:{"Authorization": "Basic "+onesignal_app_key},
		 json:true,
		 body:opt
		 };

	try{
		let r=await reqw(mops);
		console.log("r: ", r);
		}catch(e){
			console.log("err: ", e.name);
			//ctx.throw(400,e);
			}	

}

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
r=await db.query('select*from obi limit 1');
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
	ctx.body=await ctx.render('privacy',{result: a});
})


/* BLOG */

pub.get("/home/blog", reklama, pagination, async ctx=>{
	let db=ctx.db;
	let posts;
	try{
		let a=await db.query('select * from blog limit 5');
		if(a.rows.length)posts=a.rows
		}catch(e){console.log(e);}
		
		console.log("B: ", ctx.locals);
	ctx.body=await ctx.render('blogs',{locals:ctx.locals,posts:posts});
	})
	
	pub.get("/home/blog/:page", reklama, pagination, async ctx=>{
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

pub.get("/home/ru/:slug", reklama, async ctx=>{
	let db=ctx.db;
	let result;
	try{
		 result=await db.query('select*from blog where slug=$1', [ctx.params.slug]);
		}catch(e){console.log(e);}
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
	let db=ctx.db;
try{
var ban=await db.query("select*from reklama where statu=2");
ctx.state.banner=ban.rows;	
}catch(e){
	console.log("banner error: ", e);
	}
return next();
}
