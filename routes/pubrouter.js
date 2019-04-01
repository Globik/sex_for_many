const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
//const walletValidator=require('wallet-address-validator');//0.1.0
//var moment=require('moment');
//const {readf}=require('../libs/await-fs.js');//cofs
//const fs=require('fs');
//const email_enc=require('../libs/email_enc.js');
//const {Encoder, Levels, Types}=require('../libs/qr-node.js');// any need??
//const rk=require('request');
//const conf_pay=require('../config/pay.json');

const pub=new Router();

pub.get('/',async ctx=>{
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
ctx.throw(409, 'Schon authenticated!')
}else{
return ctx.redirect('/')
}
}
return passport.authenticate('local', (err,user,info,status)=>{
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
module.exports=pub;
