const PORT = 3000;
const DB_URL='postgress://globik:null@localhost:5432/test';
const Koa=require('koa');
const koaBody=require('koa-body');
const passport=require('koa-passport');
const url=require('url');
const Pool=require('pg-pool');
const PgStore=require('./libs/pg-sess.js');
const pgtypes=require('pg').types;
const render=require('koa-rend');
const serve=require('koa-static');
const session=require('koa-generic-session');
const pubrouter=require('./routes/pubrouter.js');
const mainmenu=require('./config/app.json');
//const adminrouter=require('./routes/adminrouter.js');

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str=>str);
const pars=url.parse(DB_URL);
const cauth=pars.auth.split(':');
const pg_opts = { user:cauth[0],password:cauth[1],host:pars.hostname,port:pars.port,database:pars.pathname.split('/')[1],ssl:false,
	//Client:pgn
	};
const pool = new Pool(pg_opts);
const pg_store=new PgStore(pool);

pool.on('connect', function(client){console.log('db connected!')})
pool.on('error', function(err, client){console.log('db err: ', err.name)})
pool.on('acquire', function(client){console.log('db acquired!')})

const app=new Koa();
app.keys=['your-secret']
app.use(serve(__dirname+'/public'));
app.use(session({store: pg_store}, app))

render(app,{root:'views', development: true})

app.use(koaBody())
require('./config/auth.js')(pool,passport)

app.use(passport.initialize())
app.use(passport.session())

function xhr(){
return async function xhr(ctx,next){
ctx.state.xhr=(ctx.request.get('X-Requested-With')==='XMLHttpRequest')
await next()
}
}
app.use(xhr());
app.use(async (ctx, next)=>{
ctx.state.showmodule = mainmenu;//see config/app.json
await next();	
})
app.use(pubrouter.routes()).use(pubrouter.allowedMethods())
app.use(async (ctx, next)=>{
	console.log('ctx.status!',ctx.status);
try{
await next();
if(ctx.status === 404) ctx.throw(404,"fuck not found",{user:"fuck userss"});
}catch(err){
ctx.status=err.status || 500;
console.log('THIS>STATUS: ', ctx.status);
if(ctx.status=== 404){
ctx.session.error='';
ctx.redirect('/error');}
}
});

app.on('error',(err, ctx)=>{
console.log(ctx.session);
console.log(ctx.request.session);
console.log('app.on.error: ',err.message, ctx.request);
console.log("SESSION in app on error: ");
console.log("sess: ", ctx.request.session);
});

app.on('error',function(){console.log('app err')})
pg_store.setup().then(function(){
app.listen(PORT);
console.log('soll on port: ', PORT, 'started.');
}).catch(function(er){
console.log("err setup pg_store", err.name);
});
