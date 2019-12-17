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
ctx.body=await ctx.render('room_err',{mess:e});
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
ctx.body=await ctx.render('obi',{});	
})

// MOTION PIX
//import { Request, Response, Router } from 'express';
//import { v4 as uuid } from 'uuid';
//var uuid=require('uuid');
//const express = require('express');

//const router: Router = express.Router();

class Offer {
  //sdp: string;

  //datetime: number;

  constructor(sdp, datetime) {
    this.sdp = sdp;
    this.datetime = datetime;
  }
}

class Answer {
  //sdp: string;

  //datetime: number;

  constructor(sdp, datetime) {
    this.sdp = sdp;
    this.datetime = datetime;
  }
}

class Candidate {
  //candidate: string;

  //sdpMLineIndex: number;

  //sdpMid: string;

  //datetime: number;

  constructor(candidate, sdpMLineIndex, sdpMid, datetime) {
    this.candidate = candidate;
    this.sdpMLineIndex = sdpMLineIndex;
    this.sdpMid = sdpMid;
    this.datetime = datetime;
  }
}

// [{sessonId:[connectionId,...]}]
//const clients: Map<string, Set<string>>
 //= new Map<string, Set<string>>();
 const clients=new Map();

// [{connectionId:[sessionId1, sessionId2]}]
//const connectionPair: Map<string, [string, string]> = new Map<string, [string, string]>(); // key = connectionId
const connectionPair=new Map();
// [{connectionId:Offer}]
//const offers: Map<string, Offer> = new Map<string, Offer>();
const offers=new Map();
// [{connectionId:Answer}]
//const answers: Map<string, Answer> = new Map<string, Answer>();
const answers=new Map();
// [{sessionId:[{connectionId:Candidate},...]}]
//const candidates: Map<string, Map<string, Candidate[]>> = new Map<string, Map<string, Candidate[]>>(); // key = sessionId

const candidates=new Map();

function getOrCreateConnectionIds(sessionId) {
  let connectionIds = null;
  if (!clients.has(sessionId)) {
    connectionIds = new Set();
    clients.set(sessionId, connectionIds);
  }
  connectionIds = clients.get(sessionId);
  return connectionIds;
}
/*
router.use((req: Request, res: Response, next) => {
  if (req.url === '/') {
    next();
    return;
  }
  const id: string = req.header('session-id');
  if (!clients.has(id)) {
    res.sendStatus(404);
    return;
  }
  next();
});
*/
pub.get('/motion', async(ctx)=>{
	
ctx.body=await ctx.render('motion',{})	
})
pub.get('/motion/signaling/offer', async (ctx) => {
  console.log(' GET SIGNALING OFFER:FROMTIME OCCURED!');
  const fromTime = ctx.query.fromtime ? Number(ctx.query.fromtime) : 0;
console.log("fromTime: ",fromTime);
  let arrayOffers = Array.from(offers);
  if (fromTime > 0) {
    arrayOffers = arrayOffers.filter((v) => v[1].datetime > fromTime);
  }
  const obj = arrayOffers.map((v) => ({ connectionId: v[0], sdp: v[1].sdp }));
  //res.json({ offers: obj });
  ctx.body={offers:obj};
});

/*
pub.get('/motion/signalng/answer/:fromtime', async (ctx) => {
  console.log('GET ANSWER:FROMTIME OCCURED!');
  const fromTime= ctx.params.fromtime ? Number(ctx.params.fromtime) : 0;

  const sessionId = ctx.header['session-id'];
  let connectionIds = Array.from(clients.get(sessionId));
  connectionIds = connectionIds.filter((v) => answers.has(v));

  const arr = [];
  for (const connectionId of connectionIds) {
    const answer = answers.get(connectionId);
    if (answer.datetime > fromTime) {
      arr.push({ connectionId, sdp: answer.sdp });
    }
  }
  console.log('arr in answer fromtime');
 // res.json({ answers: arr });
 ctx.body={answers:arr};
});
*/
pub.get('/motion/signaling/candidate', async (ctx) => {
  console.log('GET SIGNALING`CANDIDATE :FROMTIME OCCURED! *****************')
  const fromTime= ctx.query.fromtime ? Number(ctx.query.fromtime) : 0;
  const sessionId = ctx.header['session-id'];
  console.log('sess id:',sessionId,' params',ctx.query);
  console.log(ctx.header);
  const connectionIds = Array.from(clients.get(sessionId));
  console.log('connectionIds ',connectionIds);
  const arr = [];
  
  for (const connectionId of connectionIds) {
    const pair = connectionPair.get(connectionId);
    console.log('pair: ',pair);
    if (pair == null) {
      continue;
    }
    const otherSessionId = sessionId === pair[0] ? pair[1] : pair[0];
    console.log('other session id: ',otherSessionId);
    if (!candidates.get(otherSessionId) || !candidates.get(otherSessionId).get(connectionId)) {
      continue;
    }
    const arrayCandidates = candidates.get(otherSessionId).get(connectionId)
      .filter((v) => v.datetime > fromTime)
      .map((v) => ({ candidate: v.candidate, sdpMLineIndex: v.sdpMLineIndex, sdpMid: v.sdpMid }));
    if (arrayCandidates.length === 0) {
      continue;
    }
    console.log('arrayCandidate: ',arrayCandidates);
    arr.push({ connectionId, candidates: arrayCandidates });
  }
  //res.json({ candidates: arr });
  console.log('arr: ',arr);
  ctx.body={candidates:arr}
});

pub.get('/motion/signaling/suka', async(ctx) => {
	console.log("^^^^SIGNALING SUKA ^^^^^^$$$$$$$$$$$$$$$$$$$^^^^^^^^^^^^^^^^^**********")
	//console.log(ctx.header);
  const id = uuid();
  //console.log("ID: ",id);
  //alert(id)
  clients.set(id, new Set());
  //res.json({ sessionId: id });
  
  ctx.body={sessionId:id}
});

pub.delete('', async(ctx) => {
  const id= ctx.header['session-id'];
  clients.delete(id);
  ctx.sendStatus(200);
});

pub.put('/motion/signaling/connection', (ctx) => {
	console.log("put connection",ctx.header['user-agent'],"********************************************");
	console.log('header: ',ctx.header);
	//console.log('offers: ',offers,clients);
  const sessionId = ctx.header['session-id'];
  
  const connectionId = uuid();
  const connectionIds = getOrCreateConnectionIds(sessionId);
  connectionIds.add(connectionId);
  //res.json({ connectionId });
  ctx.body={connectionId};
});

pub.delete('/motion/signaling/connection', async(ctx) => {
	console.log('del connection***************************************************');
  const sessionId= ctx.header['session-id'];
  const { connectionId } = ctx.request.body;
  const connectionIds = clients.get(sessionId);
  connectionIds.delete(connectionId);
  connectionPair.delete(connectionId);
  ctx.status=200;
});

pub.post('/motion/signaling/offer', async(ctx) => {
	console.log('POST offer-----------------------------------------------------');
  const sessionId =ctx.header['session-id'];
  console.log('********** sessionId *************',sessionId);
  console.log("body : ",ctx.request.body);
  const { connectionId } = ctx.request.body;
  offers.set(connectionId, new Offer(ctx.request.body.sdp, Date.now()));
  connectionPair.set(connectionId, [sessionId, null]);
  //ctx.sendStatus(200);
  ctx.status=200;
  //ctx.body={info:"okli"}
});

pub.post('/motion/signaling/answer', async(ctx) => {
console.log('POST*******MOTION SIGNALING ANSWER*******************************r');
  const sessionId = ctx.header['session-id'];
  const { connectionId } = ctx.request.body;
  console.log("body2: ", ctx.request.body);
  const connectionIds = getOrCreateConnectionIds(sessionId);
  connectionIds.add(connectionId);
  answers.set(connectionId, new Answer(ctx.request.body.sdp, Date.now()));

  // add connectionPair
  const pair = connectionPair.get(connectionId);
  const otherSessionId = pair[0];
  connectionPair.set(connectionId, [otherSessionId, sessionId]);

  // update datetime for candidates
  const mapCandidates = candidates.get(otherSessionId);
  if (mapCandidates) {
    const arrayCandidates = mapCandidates.get(connectionId);
    for (const candidate of arrayCandidates) {
      candidate.datetime = Date.now();
    }
  }
 ctx.status=200;
// ctx.body={};
 
});

pub.get('/motion/signaling/answer',async (ctx)=>{
console.log('GET ANSWER:FROMTIME OCCURED!');
  const fromTime= ctx.query.fromtime ? Number(ctx.query.fromtime) : 0;
console.log("ctx.query: ",ctx.query);
  const sessionId = ctx.header['session-id'];
  console.log("sesion Id: ", sessionId);
  let connectionIds = Array.from(clients.get(sessionId));
  connectionIds = connectionIds.filter((v) => answers.has(v));

  const arr = [];
  console.log('connectionIds ', connectionIds);
  console.log('clients: ',clients);
  for (const connectionId of connectionIds) {
    const answer = answers.get(connectionId);
    if (answer.datetime > fromTime) {
      arr.push({ connectionId, sdp: answer.sdp });
    }
  }
  console.log('arr in answer fromtime',arr);
 // res.json({ answers: arr });
 ctx.body={answers:arr};


	
})
pub.get("/motion/signaling/answerly",async (ctx)=>{
	console.log("ANSWERLY");
	console.log("ctx.query: ", ctx.query);
	ctx.body={info:"OK"}
})
pub.post('/motion/signaling/candidate',async (ctx) => {
	console.log('POST SIGNALING CANDIDATE**************');
  const sessionId = ctx.header['session-id'];
  const { connectionId } = ctx.request.body;
console.log('ctx.reques body: ',ctx.request.body);
  if (!candidates.has(sessionId)) {
    candidates.set(sessionId, new Map());
  }
  const map = candidates.get(sessionId);
  if (!map.has(connectionId)) {
    map.set(connectionId, []);
  }
  const arr = map.get(connectionId);
  const candidate = new Candidate(ctx.request.body.candidate, ctx.request.body.sdpMLineIndex, ctx.request.body.sdpMid, Date.now());
  arr.push(candidate);
  console.log('arr :',arr);
  ctx.status=200;
});
pub.delete('/signaling', async ctx=>{
console.log("DELETE");
ctx.body={info:"okli"}	
})

module.exports=pub;
function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated()){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated()){
return next()
}else{ ctx.redirect('/');}}
