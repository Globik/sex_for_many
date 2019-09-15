const bodyParser=require('koa-body');
const Router=require('koa-router');

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
