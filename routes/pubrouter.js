const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const uuid=require('uuid/v4');
//const request=require('../../node_modules/request');
const reqw=require('request-promise-native');
const walletValidator=require('wallet-address-validator');//0.2.4
const gr = "\x1b[32m", rs = "\x1b[0m";

//var moment=require('moment');
//const {readf}=require('../libs/await-fs.js');//cofs
//const fs=require('fs');
//const email_enc=require('../libs/email_enc.js');
//const {Encoder, Levels, Types}=require('../libs/qr-node.js');// any need?? i think no need . must be client side

//const conf_pay=require('../config/pay.json');

const pub=new Router();

pub.get('/', async ctx=>{
let bresult;
let db=ctx.db;

try{
let s='select us_id,nick,v,age,ava,isava from room left join profile on room.nick=profile.bname;';
let bus=await db.query(s);
console.log('bus rows: ', bus.rows);
if(bus.rows.length>0){
bresult=bus.rows;
bresult.forEach(function(el,i){
	console.log('el: ',el);	
})
}
}catch(e){console.log(e)}	

	
//ctx.session.dorthin=this.path;
//if(ctx.session.bmessage){m=ctx.session.bmessage;}

ctx.body=await ctx.render('main_page',{lusers:bresult /*,m:m,roomers:bresult*/});
//ctx.body={hallo:'ok'}
//if(ctx.session.bmessage){delete ctx.session.bmessage}
});

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
return passport.authenticate('local-signup', (err,user,info,status)=>{
console.log(err,user,info,status)
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

pub.get('/webrtc/:buser_id', async function(ctx){
let us=ctx.state.user;
let db=ctx.db;
console.log("USER: ",us);
let a,result;
let owner=false;
let sis;
if(ctx.state.is_test_btc){
sis=`select buser.bname , buser.id, cladr.padrtest, cladr.cadrtest, cladr.btc_all, cladr.inv from buser left join cladr 
on buser.bname=cladr.bname where buser.id=$1`;
}else{
sis=`select buser.bname , buser.id, cladr.padr, cladr.cadr, cladr.btc_all, cladr.inv from buser left join cladr 
on buser.bname=cladr.bname where buser.id=$1`;
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
if(!vali){ctx.throw(400,"not a valid test bitcoin address!");}
}else{
let valir=walletValidator.validate(btc_client,'bitcoin');
if(!valir){ctx.throw(400,"not a valid bitcoin address!");}	
}

let db=ctx.db;
let bod=undefined;
let data={};
if (ctx.state.is_test_btc){

data.forwarding_address_primary=ctx.state.test_btc_address;//must be mine
data.forwarding_address_secondary=btc_client;//must be client's one
data.forwarding_address_primary_share="10%";//ctx.state.btc_percent;
data.callback_link=cb_link;

let mops={url: base_url_smart_tbtc, method:"post", json:true,body:data};
try{
bod=await reqw(mops);
console.log('bod: ', bod);

try{
let sql_create_smarti1="insert into cladr(bname, cadrtest, padrtest, inv, pc) values($1,$2,$3,$4,$5)";

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
data.callback_link=cb_link;

let mops={url: base_url_smart_btc, method:"post", json:true,body:data};
try{
bod=await reqw(mops);
console.log('bod: ', bod);

try{
let sql_create_smarti="insert into cladr(bname, cadr, padr, inv, pc) values($1,$2,$3,$4,$5)";

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
console.log(a.rows);
if(a.rows && a.rows.length > 0){
obj.info="ok";
obj.params=a.rows[0];	
}
}catch(e){console.log(e);}
ctx.body=obj;	
})

pub.get('/home/profile', authed, async ctx=>{
let db=ctx.db;
let err;
let a;
try{
let result=await db.query('select bname, age, isava from profile');
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
let {txt_msg, age, photo,fname}=ctx.request.body;
let db=ctx.db;
let isava=(photo?1:0);
let s='insert into profile(bname,age,msg,ava,isava) values($1,$2,$3,$4,$5) on conflict(bname) do update set age=$2,msg=$3,ava=$4,isava=$5'
try{
await db.query(s,[fname,age,txt_msg,photo,isava]);	
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
pub.get('/home/obi', async ctx=>{
	let db=ctx.db;
	let res;
	try{
	var res2=await db.query('select*from obi where isg=1');	
	//if(res2.rows&&res2.rows.length>0)res=res2.rows;
	console.log(res2.rows);
	}catch(e){console.log(e);}
ctx.body=await ctx.render('obi',{obis:res2.rows});	
})

pub.post("/api/save_obi",async ctx=>{
let {nick,msg}=ctx.request.body;
if(!nick && !msg)ctx.throw(400,"Нет необходимых данных");
let db=ctx.db;
try{
await db.query('insert into obi(bnick,msg) values($1,$2)',[nick,msg]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"ok"};	
})










module.exports=pub;
function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated()){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated()){
return next()
}else{ ctx.redirect('/');}}
