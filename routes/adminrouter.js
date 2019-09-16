const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.2.4

const adm=new Router();

adm.get('/home/profile', authed, async ctx=>{
ctx.body=await ctx.render('admin_dashboard',{});
})
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
let {test_btc_adr,percent,test, btc_adr}=ctx.request.body;
if(test){
if(!test_btc_adr)ctx.throw(400,"No testnet bitcoin address provided!")
let vali=walletValidator.validate(test_btc_adr,'bitcoin','testnet');
if(!vali){ctx.throw(400,"Not a valid testnet bitcoin address!");}
ctx.body={info:"ok",test_btc_adr,percent,test}	
}else{}
})
adm.post("/home/profile/set_btc_adr", auth, async ctx=>{

ctx.body={info:"ok"}	
})
module.exports=adm;
function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
	//console.log('is authenticated? : ',ctx.isAuthenticated());
	//console.log('state.user.role: ',ctx.state.user);
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}
