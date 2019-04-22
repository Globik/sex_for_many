const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
//const request=require('../../node_modules/request');
const reqw=require('request-promise-native');
const walletValidator=require('wallet-address-validator');//0.2.4

//var moment=require('moment');
//const {readf}=require('../libs/await-fs.js');//cofs
//const fs=require('fs');
//const email_enc=require('../libs/email_enc.js');
//const {Encoder, Levels, Types}=require('../libs/qr-node.js');// any need?? i think no need . must be client side

//const conf_pay=require('../config/pay.json');

const pub=new Router();

pub.get('/', async ctx=>{
let result=null;
//let bresult=null;
//let db=ctx.db;
//let m=null;
/*
try{
var us=await db.query(`select*from busers`);
result=us.rows;
}catch(e){console.log(e)}
*/ 
//console.log('ctx.state.user BUSERRRR: ',ctx.state.user);
/*
try{
	//rooms.status.view.src busers.id.name
let bus=await db.query(`select busers.id, busers.name,rooms.status,rooms.view,rooms.src 
from busers inner join rooms on busers.name=rooms.room_name`);//where view>=1`)
bresult=bus.rows;
//console.log('bresult: ',bresult)
}catch(e){console.log(e)}	
*/
	
//ctx.session.dorthin=this.path;
//if(ctx.session.bmessage){m=ctx.session.bmessage;}
ctx.body=await ctx.render('main_page',{lusers:result /*,m:m,roomers:bresult*/});
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
ctx.body={success:true, info:info.message, redirect:ctx.session.dorthin || '/'}
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
ctx.redirect(ctx.session.dorthin || '/')
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
ctx.body={success:true, message:info.message,redirect:ctx.session.dorthin || '/'}
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

pub.get('/webrtc/:buser_name', async ctx=>{
//	ctx.body=await ctx.render('error',{});
//ctx.body=await ctx.render('room',{model:'model', owner:true})
var model={};
model.name=ctx.params.buser_name;
ctx.body=await ctx.render('fake_room',{model});
});
//save btc address
var prim="mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE";
const base_url_smart_tbtc="https://api.bitaps.com/btc/testnet/v1/create/payment/address/distribution";//for test btc smartcontract
/*
 id serial primary key,
name  text not null references busers(bname),
cadr varchar(34) not null, -- client btc address
padr varchar(34)  not null, -- public btc adress
inv varchar(70) not null, -- invoice
pc varchar(70) not null, -- payment code
btc_amt numeric NOT NULL default 0, -- btc payment amount by address
btc_all numeric not null default 0, -- total amount received by address
is_t boolean not null default true -- is btc test
*/ 
//var sql_create_smarti="insert into cladr(name,cadr,padr,inv,pc) values($1,$2,$3,$4,$5)";
var our_procent="10%";
pub.post('/api/savebtcaddress', async ctx=>{
	console.log('body: ',ctx.request.body);
	let {btc_client, is_testnet, username}=ctx.request.body;
	if(!btc_client || !username){ctx.throw(400, "No data provided! No username ,no btc client addr!");}
let vali=walletValidator.validate(btc_client,'bitcoin','testnet');
if(!vali){ctx.throw(400,"not valid bitcoin address!");}
let db=ctx.db;
let bod=undefined;
let data={};
data.forwarding_address_primary=prim;//must be mine
data.forwarding_address_secondary=btc_client;//must be client's one
data.forwarding_address_primary_share=our_procent;
data.callback_link="https://frozen-atoll-47887.herokuapp.com/api/test_cb_smartc";

let mops={url: base_url_smart_tbtc, method:"post", json:true,body:data};
try{
bod=await reqw(mops);
console.log('bod: ', bod);

try{
var sql_create_smarti="insert into cladr(name,cadr,padr,inv,pc) values($1,$2,$3,$4,$5)";

let si=await db.query(sql_create_smarti,[
username, 
bod.forwarding_address_secondary, 
bod.address, 
bod.invoice,
bod.payment_code
]);
console.log("db query: ", si);
 
}catch(e){console.log("db error: ", e);ctx.throw(400,"db error")}
}catch(e){ctx.throw(400, e.message);}

ctx.body={status:"ok", data:"tested", is_testnet: is_testnet, bod:bod}
});

/*
data.received_amount=200;
data.invoice="invQ67P7jvsWDNQ4EY2ZnA4qbB75UY7RWpcZrnycaTzfgfz2iYUiD";
data.code= "PMTvLqJhBnFJexwS1MqPPF6uJ8cLbYh87Re6Qz4wirnYiXrAojuBk";//payment code
data.amount=4;//payment amount
data.address="2NDbrgcoVvSXjQzk7ZUQCgx5QD5SXbw1y45"
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






module.exports=pub;
