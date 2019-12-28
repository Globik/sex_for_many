const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.2.4
const reqw=require('request-promise-native');

const adm=new Router();

adm.get('/home/dashboard', authed, async ctx=>{
	ctx.body=await ctx.render('admin_dashboard',{});
});
adm.post("/home/profile/enable_btc", auth, async ctx=>{
//	ctx.state.asia="dura";
//console.log("ctx state asia: ",ctx.state.asia);
console.log("ctx request body: ", ctx.request.body);
ctx.body={info:"ok", btc_pay:ctx.state.btc_pay}	
})
adm.post("/home/profile/btc_test", auth, async ctx=>{
console.log(ctx.request.body);
ctx.body={info:"ok", is_test_btc:ctx.state.is_test_btc};	
})

adm.post("/home/profile/save_btc_adr", auth, async ctx=>{
console.log(ctx.request.body);
let db=ctx.db;
let {test_btc_adr,percent,test, btc_adr}=ctx.request.body;
if(test){
if(!test_btc_adr)ctx.throw(400,"No testnet bitcoin address provided!")
let vali=walletValidator.validate(test_btc_adr,'bitcoin','testnet');

if(!vali){ctx.throw(400,"Not a valid testnet bitcoin address!");}
try{
await db.query("delete from prim_adr where type=true");
await db.query("insert into prim_adr(adr, type) values($1, $2)",[test_btc_adr, true]);
await db.query("delete from cladr");
}catch(e){ctx.throw(400, e);}
ctx.body={info:"ok",test_btc_adr, percent, test}	
} else{
if(!test_btc_adr)ctx.throw(400,"No bitcoin address provided!")
let vali=walletValidator.validate(test_btc_adr,'bitcoin');

if(!vali){ctx.throw(400,"Not a valid bitcoin address!");}
try{
await db.query("delete from prim_adr where type=false");
await db.query("insert into prim_adr(adr, type) values($1, $2)",[test_btc_adr, false]);
await db.query("delete from cladr");
}catch(e){ctx.throw(400, e);}

ctx.body={info:"ok",test_btc_adr, percent, test}	
}
})

adm.post("/home/profile/set_btc_adr", auth, async ctx=>{
console.log("HERE request body ",ctx.request.body);
let test = ctx.request.body.test;
//console.log("TYPE: ", test);
if(test){
ctx.body={info:"fucker", btc_address: ctx.state.test_btc_address}
}else{
//console.log("HERE ADR ", ctx.state.btc_address,"type ",test)
ctx.body={info: "no fucker", btc_address: ctx.state.btc_address}	
}	
})
//new avatars of user
adm.get("/home/newavas", authed, async ctx=>{
let db=ctx.db;
let err;
let a;
try{
let result=await db.query('select bname, ava from profile where isava=1');
if(result.rows)a=result.rows;
//console.log('result: ',result.rows);	
}catch(e){err=e;}
ctx.body=await ctx.render('newavas',{err:err,result:a});	
})

adm.post('/api/ava-checked', auth, async ctx=>{
let {fname}=ctx.request.body;
if(!fname)ctx.throw(400,"Нет ника!");
let db=ctx.db;
try{
await db.query('update profile set isava=2 where bname=$1',[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:fname};	
});

adm.post('/api/ava-delete', auth, async ctx=>{
let {fname}=ctx.request.body;
if(!fname)ctx.throw(400,"Нет ника!");
let db=ctx.db;
try{
await db.query(`update profile set ava='', isava=0 where bname=$1`,[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:fname};	
})

adm.get("/home/newmsg", authed, async ctx=>{
let db=ctx.db;
let result;
try{
result=await db.query('select*from obi where isg=0');	
}catch(e){console.log(e);}	
ctx.body=await ctx.render('newmsg',{result:result.rows});
})
adm.post('/api/ok_msg', auth, async ctx=>{
let {id}=ctx.request.body;
if(!id)ctx.throw(400,"Нет идентификатора");
let db=ctx.db;
try{
await db.query('update obi set isg=1 where id=$1',[id]);	
}catch(e){
ctx.throw(400,e);	
}	
ctx.body={info:"OK",id:id};
})
adm.post('/api/del_msg', auth, async ctx=>{
let {id}=ctx.request.body;
	if(!id)ctx.throw(400,"Нет идентификатора");
let db=ctx.db;
try{
await db.query('delete from obi where id=$1',[id]);	
}catch(e){
ctx.throw(400,e);	
}	
ctx.body={info:"OK",id:id};
})

/* XIRSYS */

adm.get('/home/xirsys', authed, async ctx=>{
	console.log("URL: ", ctx.url);
	console.log("ORIGIN: ", ctx.origin);
	console.log("HOSTNAME: ", ctx.hostname);
	console.log("protocol: ", ctx.protocol);
	console.log("secure: ", ctx.secure);
ctx.body=await ctx.render('xirsys',{});	
})

adm.post('/api/get_xirsys', auth, async ctx=>{
let data={};
let v;
data.format="urls";
let mops={url: "https://Globi:"+process.env.XIRSYS_SECRET+"@global.xirsys.net/_turn/alikon",
	 method:"PUT", json:true,body:data};
	 try{
let bod=await reqw(mops);
v=bod.v.iceServers;
console.log('v: ', v);
}catch(e){ctx.throw(400, e);}
ctx.body={xir:v}	
})

adm.post('/api/set_xirsys', auth, async ctx=>{
	let {xir}=ctx.request.body;
	if(!xir)ctx.throw(400,"Ни одного сервера не предоставлено.");
	ctx.body={xir:ctx.state.xirsys}
	})
module.exports=adm;

function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}
